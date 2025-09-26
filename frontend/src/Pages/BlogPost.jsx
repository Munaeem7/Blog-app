import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { postsAPI } from "../Api/Api";

const BlogPost = () => {
  const { categorySlug, postSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);

        const { data } = await postsAPI.getAll(1, 50);

        if (!data.success) {
          throw new Error("Failed to fetch posts");
        }

        const allPosts = data.data;
        
        // Map database fields to frontend structure
        const mappedPosts = allPosts.map((dbPost) => ({
          id: dbPost.id,
          title: dbPost.title,
          slug: dbPost.slug,
          excerpt: dbPost.excerpt,
          author: dbPost.author || "Admin",
          publishedDate: dbPost.created_at,
          category: dbPost.category_name,
          imageUrl: dbPost.cover_image || "/img1.webp",
          readTime: dbPost.read_time || "5 min read",
          content: dbPost.content,
        }));

        // Find the current post by category and slug
        const foundPost = mappedPosts.find((p) => {
          const postCategorySlug = p.category.toLowerCase().replace(/\s+/g, '-');
          return postCategorySlug === categorySlug.toLowerCase() && p.slug === postSlug;
        });

        if (!foundPost) {
          console.log("Post not found, redirecting to home");
          navigate("/", { replace: true });
          return;
        }

        setPost(foundPost);

        // Get related posts from the same category
        const categoryRelatedPosts = mappedPosts.filter((p) => {
          const postCategorySlug = p.category.toLowerCase().replace(/\s+/g, '-');
          return postCategorySlug === categorySlug.toLowerCase() && p.slug !== postSlug;
        });

        setRelatedPosts(categoryRelatedPosts.slice(0, 3));

      } catch (error) {
        console.error("Error fetching post data:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [categorySlug, postSlug, navigate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div>

        <div className="flex justify-center items-center h-64 bg-white">
          <div className="animate-pulse text-gray-600">Loading post...</div>
        </div>

      </div>
    );
  }

  if (!post) {
    return (
      <div>

        <div className="flex justify-center items-center h-64 bg-white">
          <p className="text-gray-600">Post not found</p>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
 

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`/category/${categorySlug}`}
            className="hover:text-gray-900"
          >
            {post.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link
              to={`/category/${categorySlug}`}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {post.category}
            </Link>
            <span className="mx-2">•</span>
            <time dateTime={post.publishedDate}>
              {formatDate(post.publishedDate)}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center mt-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
              {getInitials(post.author)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author}</p>
              <p className="text-xs text-gray-500">Contributor</p>
            </div>
          </div>
        </header>



        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12 text-gray-800">
          {/* Handle both HTML and plain text content */}
          {post.content && (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: post.content.includes('<') ? post.content : `<p>${post.content.replace(/\n/g, '</p><p>')}</p>` 
              }} 
            />
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Link
            to={`/category/${categorySlug}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            #{post.category}
          </Link>
        </div>

        {/* Author Bio */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12 border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            About the Author
          </h3>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4 flex-shrink-0">
              {getInitials(post.author)}
            </div>
            <p className="text-gray-700">
              {post.author} is a contributor to our blog with expertise in{" "}
              {post.category.toLowerCase()}. With years of experience,{" "}
              {post.author.split(" ")[0]} brings valuable insights and practical
              advice to our readers.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More in {post.category}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedCategorySlug = relatedPost.category.toLowerCase().replace(/\s+/g, '-');
                return (
                  <article
                    key={relatedPost.id}
                    className="group bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-sm h-full flex flex-col"
                  >
                    <Link
                      to={`/category/${relatedCategorySlug}/${relatedPost.slug}`}
                      onClick={() => window.scrollTo(0, 0)}
                      className="block flex-shrink-0"
                    >
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
                        <time dateTime={relatedPost.publishedDate}>
                          {formatDate(relatedPost.publishedDate)}
                        </time>
                        <span className="mx-1.5">•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>

                      <Link
                        to={`/category/${relatedCategorySlug}/${relatedPost.slug}`}
                        onClick={() => window.scrollTo(0, 0)}
                        className="group-hover:text-gray-900 mb-2 flex-grow"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-tight transition-colors duration-200">
                          {relatedPost.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-2 mt-auto">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                            {getInitials(relatedPost.author)}
                          </div>
                          <span className="text-xs font-medium text-gray-700">
                            {relatedPost.author}
                          </span>
                        </div>
                        <Link
                          to={`/category/${relatedCategorySlug}/${relatedPost.slug}`}
                          onClick={() => window.scrollTo(0, 0)}
                          className="text-xs font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200 flex items-center"
                        >
                          Read
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>


    </div>
  );
};

export default BlogPost;
