import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  const { id, image, date, title, description } = blog;
  return (
    <div className="blog-card">
      <div className="card-image">
        <img src={image || '/logo192.png'} className="img-fluid w-100" alt={title || 'blog'} />
      </div>
      <div className="blog-content">
        <p className="date">{date || ''}</p>
        <h5 className="title" style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>{title || 'Untitled'}</h5>
        <p className="desc" style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>{description || ''}</p>
        <Link to={`/blog/${id || ''}`} className="button">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;