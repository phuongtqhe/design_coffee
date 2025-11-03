import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  const { id, image, date, title, description } = blog;
  return (
    <div className="card shadow-sm border-0 rounded-12 hover-elevate blog-card h-100">
      <div className="card-image" style={{ height: 200, overflow: 'hidden' }}>
        <img src={image || '/logo192.png'} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} alt={title || 'blog'} />
      </div>
      <div className="card-body">
        <p className="text-muted small mb-1">{date || ''}</p>
        <h5 className="card-title mb-2" style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}>{title || 'Untitled'}</h5>
        <p className="card-text" style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>{description || ''}</p>
        <Link to={`/blog/${id || ''}`} className="btn btn-outline-primary btn-sm">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;