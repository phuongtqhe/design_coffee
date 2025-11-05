import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import addcart from "../images/add-cart.svg";
import { useCart } from "../components/CartContext";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [availableToppings, setAvailableToppings] = useState([]);

  const sizes = [
    { label: "Nhỏ", value: "small", price: 0 },
    { label: "Vừa", value: "medium", price: 10000 },
    { label: "Lớn", value: "large", price: 20000 },
  ];

  // Options similar to AddToCartModal
  const [options, setOptions] = useState({
    iceLevel: "Bình thường",
    sugarLevel: "100%",
    toppings: [],
    quantity: 1,
    size: selectedSize,
  });

  const { addToCart } = useCart();

  // Sync size into options when selectedSize changes
  useEffect(() => {
    setOptions(prev => ({ ...prev, size: selectedSize }));
  }, [selectedSize]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productRes, toppingsRes, catToppingRes, categoriesRes] = await Promise.all([
          axios.get(`http://localhost:9999/products/${id}`),
          axios.get(`http://localhost:9999/toppings`),
          axios.get(`http://localhost:9999/categories_topping`),
          axios.get(`http://localhost:9999/categories`),
        ]);

        const currentProduct = productRes.data;
        setProduct(currentProduct);

        if (currentProduct.categoryId) {
          const currentCategory = categoriesRes.data.find(c => String(c.id) === String(currentProduct.categoryId));
          setCategory(currentCategory);

          // Filter toppings
          const allowedToppingIds = catToppingRes.data[currentProduct.categoryId] || [];
          const filteredToppings = toppingsRes.data.filter(t => allowedToppingIds.includes(String(t.id)));
          setAvailableToppings(filteredToppings);

          // Fetch related products
          try {
            const relRes = await axios.get(
              `http://localhost:9999/products?categoryId=${currentProduct.categoryId}`
            );
            const rel = (relRes.data || []).filter(p => String(p.id) !== String(currentProduct.id)).slice(0, 4);
            setRelatedProducts(rel);
          } catch (err) {
            console.error('Error fetching related products', err);
            setRelatedProducts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <Container class1="product-detail-wrapper py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container class1="product-detail-wrapper py-5">
        <div className="text-center">
          <h3>Không tìm thấy sản phẩm</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/products")}>
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </Container>
    );
  }

  const currentSize = sizes.find((s) => s.value === selectedSize);
  const finalPrice = product.price + (currentSize?.price || 0);

  const handleToppingChange = (topping) => {
    setOptions(prev => ({
      ...prev,
      toppings: prev.toppings.includes(topping.name)
        ? prev.toppings.filter(t => t !== topping.name)
        : [...prev.toppings, topping.name]
    }));
  };

  const calculateToppingPrice = () => {
    return options.toppings.reduce((sum, name) => {
      const t = availableToppings.find(x => x.name === name);
      return sum + (t ? t.price : 0);
    }, 0);
  };

  const calculateTotalPrice = () => {
    const sizeExtra = sizes.find(s => s.value === options.size)?.price || 0;
    const base = (product.price + sizeExtra + calculateToppingPrice()) * (options.quantity || 1);
    return base;
  };

  const handleAddToCart = () => {
    // Build options object expected by CartContext
    const cartOptions = {
      iceLevel: options.iceLevel,
      sugarLevel: options.sugarLevel,
      toppings: options.toppings,
      quantity: options.quantity
    };
    addToCart(product, cartOptions);
    toast.success(`Đã thêm ${product.name || product.title} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <Container class1="product-detail-wrapper py-5">
      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="main-product-image p-4">
              <img
                src={product.images?.[selectedImage] || "/logo192.png"}
                alt={product.name}
                className="img-fluid rounded"
                style={{ 
                  width: "100%", 
                  height: "500px", 
                  objectFit: "contain",
                  background: "#f8f9fa"
                }}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2 p-3 justify-content-center">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`border rounded cursor-pointer ${
                      selectedImage === index ? "border-primary border-3" : ""
                    }`}
                    style={{ width: "80px", height: "80px", cursor: "pointer" }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="product-details">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/" className="text-decoration-none">Trang chủ</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/products" className="text-decoration-none">Sản phẩm</a>
                </li>
                {category && (
                  <li className="breadcrumb-item text-muted">{category.name}</li>
                )}
              </ol>
            </nav>

            {/* Product Title */}
            <h1 className="h2 fw-bold mb-3">{product.title}</h1>
            <i className="mt-3">{product.description}</i>

            {/* Rating */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <ReactStars
                count={5}
                size={24}
                value={4}
                edit={false}
                activeColor="#ffc107"
              />
              <span className="text-muted">(4.0 / 5)</span>
            </div>

            {/* Category */}
            {category && (
              <div className="mb-3">
                <span className="badge bg-light text-dark border px-3 py-2">
                  {category.name}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-4">
              <p className="text-muted lead">{product.describe}</p>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="text-primary fw-bold mb-0">
                {finalPrice.toLocaleString("vi-VN")} ₫
              </h3>
              {currentSize?.price > 0 && (
                <small className="text-muted">
                  (Giá gốc: {product.price.toLocaleString("vi-VN")} ₫ + {currentSize.price.toLocaleString("vi-VN")} ₫)
                </small>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <h5 className="mb-3">Chọn size (bắt buộc):</h5>
              <div className="d-flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`btn ${
                      selectedSize === size.value
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedSize(size.value)}
                    style={{ minWidth: "120px" }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <i className="bi bi-cup"></i>
                      <span>{size.label}</span>
                      {size.price > 0 && (
                        <small>+ {(size.price / 1000).toFixed(0)}k</small>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options & Action Buttons (same features as AddToCartModal) */}
            <div className="mb-4">
              <h5 className="mb-2">Tùy chọn</h5>

              {/* Ice Level */}
              {category?.hasIceLevel && (
                <div className="mb-3">
                  <div className="fw-bold mb-2">Độ đá</div>
                  <div>
                    {["Không đá", "Ít đá", "Bình thường", "Nhiều đá"].map((level) => (
                      <button
                        key={level}
                        className={`btn btn-sm me-2 ${options.iceLevel === level ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setOptions(prev => ({ ...prev, iceLevel: level }))}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugar Level */}
              {category?.hasSugarLevel && (
                <div className="mb-3">
                  <div className="fw-bold mb-2">Độ ngọt</div>
                  <div>
                    {["0%", "30%", "50%", "70%", "100%"].map((level) => (
                      <button
                        key={level}
                        className={`btn btn-sm me-2 ${options.sugarLevel === level ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setOptions(prev => ({ ...prev, sugarLevel: level }))}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toppings */}
              <div className="mb-3">
                <div className="fw-bold mb-2">Topping (tùy chọn)</div>
                <div className="d-flex flex-wrap gap-2">
                  {availableToppings.map((t) => (
                    <label key={t.name} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        checked={options.toppings.includes(t.name)}
                        onChange={() => handleToppingChange(t)}
                        className="form-check-input me-2"
                      />
                      {t.name} (+{t.price.toLocaleString('vi-VN')} ₫)
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity & Size */}
              <div className="mb-3 d-flex align-items-center gap-3">
                <div>
                  <div className="fw-bold mb-2">Số lượng</div>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-outline-secondary" onClick={() => setOptions(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
                    <input
                      type="number"
                      value={options.quantity}
                      onChange={(e) => setOptions(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                      min="1"
                      className="form-control mx-2 text-center"
                      style={{ width: '80px' }}
                    />
                    <button className="btn btn-outline-secondary" onClick={() => setOptions(prev => ({ ...prev, quantity: prev.quantity + 1 }))}>+</button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <div className="small text-muted">Tạm tính:</div>
                  <div className="fw-bold text-primary">{calculateTotalPrice().toLocaleString('vi-VN')} ₫</div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success d-flex align-items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}
                    onClick={handleAddToCart}
                  >
                    <img src={addcart} alt="add to cart" style={{ width: 18, height: 18 }} /> Add to cart
                  </button>
                  <button className="btn btn-primary" onClick={handleBuyNow}>Buy now</button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card border-0 bg-light p-4">
              <h5 className="mb-3">Thông tin sản phẩm</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Được pha chế từ nguyên liệu tươi ngon
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Đảm bảo chất lượng cao nhất
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Giao hàng nhanh chóng trong 30 phút
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Hỗ trợ khách hàng 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related products (same category) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="mb-4">Sản phẩm cùng danh mục</h4>
          </div>
          <div className="col-12">
            <div className="row">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} grid={4} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="row mt-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetail;


