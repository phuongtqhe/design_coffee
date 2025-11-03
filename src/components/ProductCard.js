import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import addcart from "../images/add-cart.svg";
import axios from "axios";
import AddToCartModal from "./AddToCartModal";

const ProductCard = (props) => {
  const { grid, product } = props;
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  let location = useLocation();

  return (
    <>
      {!product ? null : (
      <div
        className={`${location.pathname === "/product" ? `gr-${grid || 3}` : "col-12 col-sm-6 col-lg-3 mb-4"}`}
      >
        <div className="card h-100 shadow-sm border-0 rounded-12 hover-elevate product-card">
          <div className="position-relative">
            {/* Product Image */}
            <div className="product-image-container" style={{ height: "250px", overflow: "hidden" }}>
              <Link to={`/product/${product.id}`} className="d-block w-100 h-100">
                <img
                  src={(product.images && product.images[0]) || "/logo192.png"}
                  className="img-fluid w-100 h-100"
                  alt={product.title || product.name || "product image"}
                  style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
              </Link>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="card-body d-flex flex-column">
            <h5
              className="card-title mb-3"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "1.05rem",
                fontWeight: "600"
              }}
              title={product.name || product.title}
            >
              <Link to={`/product/${product.id}`} className="text-decoration-none text-reset">
                {product.name || product.title}
              </Link>
            </h5>
            
            <div className="mt-auto">
              {/* Action Buttons */}
              <div className="d-flex gap-2 align-items-center">
                <div className="flex-grow-1">
                  <h6 className="price mb-0 text-primary fw-bold fs-5">
                    {product.price ? product.price.toLocaleString('vi-VN') + ' ₫' : ''}
                  </h6>
                </div>
                <button 
                  className="btn btn-success btn-sm fw-bold"
                  title="Add to Cart"
                  onClick={() => setShowAddToCartModal(true)}
                  style={{ 
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    border: "none",
                  }}
                >
                  <img src={addcart} alt="addcart" style={{ width: "16px", height: "16px", marginRight: "6px" }} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Add to Cart Modal */}
      <AddToCartModal 
        show={showAddToCartModal}
        onHide={() => setShowAddToCartModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;