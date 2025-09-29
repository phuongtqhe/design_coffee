import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <div className="card-image">
        <img src={blog.image} className="img-fluid w-100" alt="blog" />
      </div>
      <div className="blog-content">
        <p className="date">{blog.date}</p>
        <h5 className="title">{blog.title}</h5>
        <p className="desc">{blog.description}</p>
        <Link to={`/blog/${blog.id}`} className="button">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;