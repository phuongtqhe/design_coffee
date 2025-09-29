import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/products")
      .then((res) => {
        setProducts(res.data.slice(0, 4));
        setFeaturedProducts(res.data.slice(4, 8));
      })
      .catch((err) => console.log(err));
    axios
      .get("http://localhost:9999/blogs")
      .then((res) => {
        setBlogs(res.data.slice(0, 4));
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
              <div className="main-banner-content position-absolute">
                <h4>FRESHLY ROASTED</h4>
                <h5>Discover Your Perfect Coffee</h5>
                <p>From $3.00</p>
                <Link to="/product" className="button">
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="categories d-flex justify-content-between flex-wrap align-items-center">
              <div className="d-flex gap align-items-center">
                <div>
                  <h6>Espresso</h6>
                  <p>10 Items</p>
                </div>
                <img src="/logo192.png" alt="camera" />
              </div>
              <div className="d-flex gap align-items-center">
                <div>
                  <h6>Latte</h6>
                  <p>10 Items</p>
                </div>
                <img src="/logo192.png" alt="camera" />
              </div>
              <div className="d-flex gap align-items-center">
                <div>
                  <h6>Cappuccino</h6>
                  <p>10 Items</p>
                </div>
                <img src="/logo192.png" alt="camera" />
              </div>
              <div className="d-flex gap align-items-center">
                <div>
                  <h6>Americano</h6>
                  <p>10 Items</p>
                </div>
                <img src="/logo192.png" alt="camera" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <h3 className="section-heading">Featured Collection</h3>
        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>

      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Special Products</h3>
          </div>
        </div>
        <div className="row">
          {featuredProducts.map((product) => (
            <SpecialProduct key={product.id} product={product} />
          ))}
        </div>
      </Container>

      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>

      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Latest Blogs</h3>
          </div>
        </div>
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-3" key={blog.id}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default Home;