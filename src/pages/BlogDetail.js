import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:9999/blogs/${id}`)
        .then((res) => {
          setBlog(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Container class1="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container class1="py-5">
        <div className="text-center">
          <h2>Blog Not Found</h2>
          <p>The blog you're looking for doesn't exist.</p>
          <Link to="/blogs" className="btn btn-primary">
            Back to Blogs
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container class1="blog-detail-wrapper py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="blog-detail">
              <Link to="/blogs" className="btn btn-outline-secondary mb-4">
                ← Back to Blogs
              </Link>
              
              <div className="blog-image mb-4">
                <img
                  src={blog.image || "/logo192.png"}
                  alt={blog.title}
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                />
              </div>

              <div className="blog-content">
                <div className="blog-meta mb-3">
                  <span className="text-muted">{blog.date}</span>
                </div>
                
                <h1 className="blog-title mb-4">{blog.title}</h1>
                
                <div className="blog-description">
                  <p className="lead">{blog.description}</p>
                  {/* Add more detailed content here when available */}
                  <p>
                    This is a detailed view of the blog post. In a real application, 
                    you would have more content here, including the full blog post text, 
                    images, and other rich content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BlogDetail;
