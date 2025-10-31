import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import Container from "../components/Container";
import addcart from "../images/add-cart.svg";
import wish from "../images/wish.svg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("medium");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get(`http://localhost:9999/products/${id}`);
        setProduct(productRes.data);

        // Fetch category info
        if (productRes.data.categoryId) {
          const categoryRes = await axios.get(
            `http://localhost:9999/categories/${productRes.data.categoryId}`
          );
          setCategory(categoryRes.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  const sizes = [
    { label: "Nhỏ", value: "small", price: 0 },
    { label: "Vừa", value: "medium", price: 10000 },
    { label: "Lớn", value: "large", price: 20000 },
  ];

  const currentSize = sizes.find((s) => s.value === selectedSize);
  const finalPrice = product.price + (currentSize?.price || 0);

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
            <h1 className="h2 fw-bold mb-3">{product.name}</h1>

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

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-success btn-lg flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                }}
              >
                <img src={addcart} alt="add to cart" style={{ width: "20px", height: "20px" }} />
                <span className="fw-bold">MUA NGAY</span>
              </button>
              <button
                className="btn btn-outline-danger btn-lg"
                style={{ width: "60px", height: "60px" }}
              >
                <img src={wish} alt="wishlist" style={{ width: "24px", height: "24px" }} />
              </button>
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


