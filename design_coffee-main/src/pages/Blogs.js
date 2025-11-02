import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard"; 
import Container from "../components/Container"; 
import axios from "axios";
import Layout from '../components/Layout'; 


const BASE_API_URL = "http://localhost:9999";

const CATEGORIES = [
  "All", 
  "Coffee Beans", 
  "Brewing Methods", 
  "Cafe Culture", 
  "Recipes"
];

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    let url = `${BASE_API_URL}/blogs`;
    if (selectedCategory && selectedCategory !== "All") {
      url = `${BASE_API_URL}/blogs?category=${selectedCategory}`;
    }

    axios
      .get(url)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải Blogs:", err);
        setError("Không thể tải danh sách Blog. Vui lòng kiểm tra JSON Server (Port 9999).");
        setLoading(false);
      });
  }, [selectedCategory]); 


  useEffect(() => {
    setLoadingProducts(true);
    const productUrl = `${BASE_API_URL}/products?_sort=id&_order=desc&_limit=3`; 

    axios
      .get(productUrl)
      .then((res) => {
        setProducts(res.data);
        setLoadingProducts(false);
      })
      .catch(() => {
        setLoadingProducts(false);
      });
  }, []); 

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  

  if (loading && blogs.length === 0) {
    return <Layout><div className="text-center py-5">Đang tải Blogs...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-danger text-center py-5">Lỗi: {error}</div></Layout>;
  }

  return (
    <Container class1="blog-wrapper py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="section-heading text-center mb-4">Our Latest Blogs</h1>
        </div>
      </div>

      <div className="row mb-5 justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-8">
              <div className="input-group">
                  <label className="input-group-text fw-bold" htmlFor="categorySelect">Filter by Category</label>
                  <select 
                      className="form-select" 
                      id="categorySelect"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                  >
                      {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                      ))}
                  </select>
              </div>
          </div>
      </div>
      
      <div className="row">
          <div className="col-lg-8 col-md-9 order-2 order-md-1">
              
              {blogs.length === 0 ? (
                  <div className="text-center py-5">
                      <p className="lead">Không tìm thấy bài viết nào trong danh mục **"{selectedCategory}"**.</p>
                  </div>
              ) : (
                  <div className="row g-4">
                      {blogs.map((blog) => (
                          <div className="col-12 col-md-6 col-lg-6" key={blog.id}>
                              <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">
                                  <BlogCard blog={blog} />
                              </Link>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          
          <div className="col-lg-4 col-md-3 order-1 order-md-2 mb-4">
              <div className="p-3 shadow-sm rounded-3 bg-white sticky-top border" style={{ top: '20px' }}>
                  <h5 className="mb-4 text-center text-success">🎉 New Products</h5>
                  
                  {loadingProducts ? (
                      <div className="text-center small">Đang tải sản phẩm...</div>
                  ) : products.length === 0 ? (
                      <div className="text-center small">Chưa có sản phẩm mới.</div>
                  ) : (
                      <div className="list-group list-group-flush">
                          {products.map((product) => (
                              <Link 
                                  to={`/product/${product.id}`} 
                                  key={product.id} 
                                  className="list-group-item list-group-item-action py-3 d-flex align-items-center"
                              >
                                  <img 
                                      src={product.images && product.images[0]} 
                                      alt={product.title || product.name} 
                                      className="rounded me-3" 
                                      style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                  />
                                  <div>
                                      <p className="mb-0 fw-bold text-truncate" style={{ maxWidth: '180px' }}>{product.title || product.name}</p>
                                      <small className="text-danger fw-bold">{product.price?.toLocaleString('vi-VN') || 0} $</small>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>
    </Container>
  );
};

export default Blogs;