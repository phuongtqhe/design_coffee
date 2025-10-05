import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from "react-router-dom";
import prodcompare from "../images/prodcompare.svg";
import wish from "../images/wish.svg";
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import axios from "axios";
const ProductCard = (props) => {
  const { grid, product } = props;
  const [brands, setBrands] = useState([]);
  let location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:9999/brands")
      .then((res) => res.data)
      .then((data) => setBrands(data))
      .catch(() => setBrands([]));
  }, []);

  return (
    <>
      {!product ? null : (
      <div
        className={`${location.pathname === "/product" ? `gr-${grid || 3}` : "col-12 col-sm-6 col-lg-3 mb-4"}`}
      >
        <div className="card h-100 shadow-sm border-0 rounded-12 hover-elevate product-card">
          <div className="position-relative">
            {/* Wishlist Button */}
            <button 
              className="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
              style={{ width: "35px", height: "35px", zIndex: 2 }}
            >
              <img src={wish} alt="wishlist" style={{ width: "18px", height: "18px" }} />
            </button>
            
            {/* Product Image */}
            <div className="product-image-container" style={{ height: "250px", overflow: "hidden" }}>
              <img
                src={(product.images && product.images[0]) || "/logo192.png"}
                className="img-fluid w-100 h-100"
                alt={product.name || "product image"}
                style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="card-body d-flex flex-column">
            <div className="mb-2">
              <small className="text-muted text-uppercase fw-medium">
                {brands.find((b) => b.id === product.brand)?.name || product.name || "Coffee"}
              </small>
            </div>
            
            <h5
              className="card-title mb-2"
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "1.1rem",
                fontWeight: "600"
              }}
              title={product.describe || product.name}
            >
              {product.describe || product.name}
            </h5>
            
            <div className="mb-2">
              <ReactStars
                count={5}
                size={20}
                value={4}
                edit={false}
                activeColor="#ffc107"
              />
            </div>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="price mb-0 text-primary fw-bold fs-5">
                  ${Number(product.price).toFixed(2)}
                </h6>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary btn-sm flex-fill"
                  title="Compare"
                >
                  <img src={prodcompare} alt="compare" style={{ width: "16px", height: "16px" }} />
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm flex-fill"
                  title="Quick View"
                >
                  <img src={view} alt="view" style={{ width: "16px", height: "16px" }} />
                </button>
                <button 
                  className="btn btn-success btn-sm flex-fill fw-bold"
                  title="Add to Cart"
                  style={{ 
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(40, 167, 69, 0.3)";
                  }}
                >
                  <img src={addcart} alt="addcart" style={{ width: "16px", height: "16px", marginRight: "4px" }} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default ProductCard;