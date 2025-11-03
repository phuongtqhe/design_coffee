import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Container from "../components/Container";
import Layout from '../components/Layout';

const BASE_API_URL = 'http://localhost:9999'; 

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); 
    setError(null);
    
    if (id) {
      axios
        .get(`${BASE_API_URL}/blogs/${id}`) 
        .then((res) => {
          setBlog(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fail to load blog:", err);
          if (err.response && err.response.status === 404) {
                    setError(`Không tìm thấy blog có ID: ${id}.`);
                } else {
                    setError('Không thể tải dữ liệu blog. Vui lòng kiểm tra JSON Server.');
                }
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <Layout><div className="text-center py-5">Đang tải chi tiết Blog...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-danger text-center py-5">Lỗi: {error}</div></Layout>;
  }

  if (!blog) {
    return <Layout><div className="text-center py-5">Bài viết này không tồn tại hoặc đã bị xóa.</div></Layout>;
  }

  return (
      <Container class1="blog-detail-wrapper py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <div className="blog-detail">
              
              <Link to="/blogs" className="btn btn-outline-secondary mb-4">
                ← Back to Blogs
              </Link>
              
              <div className="blog-image mb-4 text-center">
                <img
                  src={blog.image || "/logo192.png"}
                  alt={blog.title}
                  className="img-fluid rounded shadow-lg"
                  style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
                />
              </div>

              <div className="blog-content">
                <div className="blog-meta mb-3 text-muted">
                  <span className="badge bg-secondary me-2">{blog.category || 'General'}</span>
                  Ngày đăng: {blog.date}
                </div>
                
                <h1 className="blog-title mb-4 display-5 fw-bold">{blog.title}</h1>
                
                <div className="blog-description">
                  <p className="lead fw-bold">{blog.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
  );
};

export default BlogDetail;