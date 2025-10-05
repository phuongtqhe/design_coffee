import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import axios from "axios";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/products")
      .then((res) => {
        setFeaturedProducts(res.data.slice(0, 8));
      })
      .catch((err) => console.log(err));
    axios
      .get("http://localhost:9999/blogs")
      .then((res) => {
        setBlogs(res.data.slice(0, 10));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-12">
            <div className="main-banner position-relative ">
              <img
                src="https://cdn.hstatic.net/files/1000075078/file/web_moi_-_desktop_6af030d55d494232a74d0205de3e38af.jpg"
                className="img-fluid rounded-3"
                alt="main banner"
                style={{ objectFit: 'cover', height: '400px', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </Container>

      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <h3 className="section-heading">Featured Drink Collection</h3>
        <div className="row">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>

      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Latest Blogs</h3>
          </div>
        </div>
        <div className="row g-3">
          {blogs.length > 0 && (
            <div className="col-12 col-lg-6" key={`featured-${blogs[0].id}`}>
              <div className="card shadow-sm border-0 rounded-12 hover-elevate h-100">
                <div style={{ height: 320, overflow: 'hidden' }}>
                  <img src={blogs[0].image || '/logo192.png'} alt={blogs[0].title} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-1">{blogs[0].date}</p>
                  <h4 className="card-title">{blogs[0].title}</h4>
                  <p className="card-text">{blogs[0].description}</p>
                  <Link to={`/blog/${blogs[0].id}`} className="btn btn-primary btn-sm">Read More</Link>
                </div>
              </div>
            </div>
          )}
          {blogs.slice(1).map((blog) => (
            <div className="col-12 col-sm-6 col-lg-3" key={blog.id}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </Container>

      <Container class1="marquee-wrapper py-5">
        <Marquee gradient={false} speed={50} pauseOnHover>
          <span className="mx-5 fs-4 fw-bold text-secondary">GRAB</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">SHOPEE</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">VISA</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">PAYPAL</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">SENDO</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">MASTERCARD</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">APPLE PAY</span>
          <span className="mx-5 fs-4 fw-bold text-secondary">GOOGLE PAY</span>
        </Marquee>
      </Container>
    </>
  );
};

export default Home;