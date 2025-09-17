// src/pages/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Navbar/Footer/Footer";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Mock data - replace with your API calls
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        // In a real app,  fetch from API
        // const response = await axios.get(`/api/posts/${slug}`);
        // setPost(response.data);
        
        // Mock data for demonstration
        const allPosts = [
          {
            id: 1,
            title: "Eco-Friendly Travel Tips",
            slug: "eco-travel-tips",
            excerpt: "Learn how to travel sustainably with these eco-friendly tips for your next adventure.",
            content: `
              <p class="mb-4">Traveling is one of life's greatest pleasures, but it often comes with an environmental cost. As awareness about climate change grows, more travelers are seeking ways to explore the world responsibly. Here are some practical eco-friendly travel tips to help you reduce your carbon footprint while still enjoying amazing experiences.</p>
              
              <h2 class="text-2xl font-bold mt-8 mb-4">Choose Sustainable Transportation</h2>
              <p class="mb-4">Whenever possible, opt for trains or buses instead of flights for shorter distances. If you must fly, consider direct flights as takeoffs and landings create most of an airplane's carbon emissions.</p>
              
              <h2 class="text-2xl font-bold mt-8 mb-4">Pack Light and Right</h2>
              <p class="mb-4">The heavier the vehicle, the more fuel it consumes. Pack only what you need and choose eco-friendly products like reef-safe sunscreen, reusable water bottles, and toiletries in biodegradable packaging.</p>
              
              <h2 class="text-2xl font-bold mt-8 mb-4">Support Local Economies</h2>
              <p class="mb-4">Eat at local restaurants, shop at local markets, and choose locally-owned accommodations. This not only reduces the carbon footprint associated with importing goods but also supports the community you're visiting.</p>
              
              <h2 class="text-2xl font-bold mt-8 mb-4">Respect Wildlife and Natural Areas</h2>
              <p class="mb-4">Always observe wildlife from a distance, stay on marked trails, and follow the principle of "leave no trace" by taking all your waste with you.</p>
              
              <p class="mt-8">By adopting these practices, you can make a positive impact while satisfying your wanderlust. Sustainable travel isn't about perfection; it's about making better choices whenever possible.</p>
            `,
            author: "Jane Doe",
            publishedDate: "2025-09-15",
            category: "Travel",
            imageUrl: "/images/eco-travel.jpg",
            readTime: "6 min read",
          },
          {
            id: 2,
            title: "Retirement Planning 101",
            slug: "retirement-planning-101",
            excerpt: "Essential steps to secure your financial future with smart retirement strategies.",
            content: "<p>Retirement planning content would go here...</p>",
            author: "John Smith",
            publishedDate: "2025-09-14",
            category: "Finance",
            imageUrl: "/images/retirement.jpg",
            readTime: "5 min read",
          },
          // Add other posts as needed
        ];
        
        const foundPost = allPosts.find(p => p.slug === slug);
        setPost(foundPost || allPosts[0]);
        
        // Set related posts (filter out the current post)
        setRelatedPosts(allPosts.filter(p => p.slug !== slug).slice(0, 3));
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64 bg-white">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64 bg-white">
          <p className="text-gray-600">Post not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${post.category.toLowerCase()}`} className="hover:text-gray-900">
            {post.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link 
              to={`/category/${post.category.toLowerCase()}`}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {post.category}
            </Link>
            <span className="mx-2">•</span>
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
          
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

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Link 
            to={`/category/${post.category.toLowerCase()}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            #{post.category}
          </Link>
          {/* Add more tags if needed */}
        </div>

        {/* Author Bio */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12 border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">About the Author</h3>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4 flex-shrink-0">
              {getInitials(post.author)}
            </div>
            <p className="text-gray-700">
              {post.author} is a contributor to our blog with expertise in {post.category.toLowerCase()}. 
              With years of experience, {post.author.split(' ')[0]} brings valuable insights and practical advice to our readers.
            </p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center mb-12">
          <span className="text-sm font-medium text-gray-700 mr-4">Share this article:</span>
          <div className="flex space-x-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.033 10.033 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost.id} className="group bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:shadow-sm h-full flex flex-col">
                  <Link to={`/blog/${relatedPost.slug}`} className="block flex-shrink-0">
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
                      <time dateTime={relatedPost.publishedDate}>{formatDate(relatedPost.publishedDate)}</time>
                      <span className="mx-1.5">•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${relatedPost.slug}`} className="group-hover:text-gray-900 mb-2 flex-grow">
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
                        <span className="text-xs font-medium text-gray-700">{relatedPost.author}</span>
                      </div>
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
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
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;