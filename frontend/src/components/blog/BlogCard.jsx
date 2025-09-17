// src/components/blog/BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  const {
    title,
    slug,
    excerpt,
    author,
    publishedDate,
    category,
    imageUrl,
    readTime = "5 min read"
  } = post;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <article className="group bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer h-full flex flex-col">
      {/* Image container */}
      <Link to={`/blog/${slug}`} className="block flex-shrink-0 relative">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img 
            src={imageUrl || "/api/placeholder/300/200"} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium tracking-wide">
            {category}
          </span>
        </div>
      </Link>
      
      {/* Content container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Date and read time */}
        <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          <span className="mx-1.5">•</span>
          <span>{readTime}</span>
        </div>
        
        {/* Title */}
        <Link to={`/blog/${slug}`} className="group-hover:text-gray-900 mb-2 flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed">
          {excerpt}
        </p>
        
        {/* Author and read more */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-center">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
              {getInitials(author)}
            </div>
            <span className="text-xs font-medium text-gray-700">{author}</span>
          </div>
          <Link 
            to={`/blog/${slug}`}
            className="text-xs font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200 flex items-center"
          >
            Read
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
