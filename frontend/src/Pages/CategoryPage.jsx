import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Navbar/Footer/Footer";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch from your API:
        // const categoryRes = await axios.get(`/api/categories/${slug}`);
        // const postsRes = await axios.get(`/api/categories/${slug}/posts`);
        
        // Mock category data
        const categoryData = {
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          description: `Explore our latest articles and insights about ${slug}. Stay updated with the most relevant content in this category.`,
          imageUrl: "/images/category-header.jpg",
        };
        
        // Mock posts data filtered by category
        const allPosts = [
          {
            id: 1,
            title: "Eco-Friendly Travel Tips",
            slug: "eco-travel-tips",
            excerpt: "Learn how to travel sustainably with these eco-friendly tips for your next adventure.",
            author: "Jane Doe",
            publishedDate: "2025-09-15",
            category: "travel",
            imageUrl: "/images/eco-travel.jpg",
            readTime: "6 min read",
          },
          {
            id: 2,
            title: "Retirement Planning 101",
            slug: "retirement-planning-101",
            excerpt: "Essential steps to secure your financial future with smart retirement strategies.",
            author: "John Smith",
            publishedDate: "2025-09-14",
            category: "finance",
            imageUrl: "/images/retirement.jpg",
            readTime: "5 min read",
          },
          {
            id: 3,
            title: "AI in Everyday Finance",
            slug: "ai-in-finance",
            excerpt: "Discover how artificial intelligence is transforming personal finance and investment.",
            author: "Alex Johnson",
            publishedDate: "2025-09-13",
            category: "technology",
            imageUrl: "/images/ai-finance.jpg",
            readTime: "7 min read",
          },
          {
            id: 4,
            title: "Designing Luxurious Interiors",
            slug: "luxury-interiors",
            excerpt: "Inspiration and tips for creating high-end interior spaces in your home.",
            author: "Emily Clark",
            publishedDate: "2025-09-12",
            category: "luxury",
            imageUrl: "/images/luxury-interiors.jpg",
            readTime: "6 min read",
          },
          {
            id: 5,
            title: "Top 10 Luxury Destinations for 2026",
            slug: "luxury-destinations-2026",
            excerpt: "A curated list of the most exclusive destinations to visit in the coming year.",
            author: "Michael Lee",
            publishedDate: "2025-09-11",
            category: "travel",
            imageUrl: "/images/luxury-destinations.jpg",
            readTime: "8 min read",
          },
          {
            id: 6,
            title: "Investment Strategies in Uncertain Markets",
            slug: "investment-strategies",
            excerpt: "Key approaches to protect and grow your portfolio during market volatility.",
            author: "Sarah Patel",
            publishedDate: "2025-09-10",
            category: "finance",
            imageUrl: "/images/investment-strategies.jpg",
            readTime: "7 min read",
          },
        ];

        const filteredPosts = allPosts.filter(post => 
          post.category.toLowerCase() === slug.toLowerCase()
        );

        setCategory(categoryData);
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      <main className="bg-white text-gray-900">
        {/* Header with category banner */}
        <header
          className="h-72 bg-cover bg-center flex items-center relative"
          style={{ backgroundImage: `url(${category.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center w-full">
            <nav className="text-sm text-gray-300 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Categories</span>
              <span className="mx-2">/</span>
              <span className="text-white">{category.name}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">{category.description}</p>
          </div>
        </header>

        {/* Main content */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Posts list */}
            <div className="lg:w-8/12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {posts.length} Article{posts.length !== 1 ? 's' : ''} in {category.name}
                </h2>
              </div>

              {posts.length > 0 ? (
                <div className="space-y-10">
                  {posts.map(post => (
                    <article key={post.id} className="flex flex-col md:flex-row gap-6 group">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block md:w-5/12 lg:w-4/12 h-48 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md"
                      >
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <div className="md:w-7/12 lg:w-8/12">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                          <span className="mx-2">•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <Link 
                          to={`/blog/${post.slug}`} 
                          className="text-xl md:text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors block mb-3"
                        >
                          {post.title}
                        </Link>
                        <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
                              {getInitials(post.author)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{post.author}</span>
                          </div>
                          <Link 
                            to={`/blog/${post.slug}`}
                            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors flex items-center"
                          >
                            Read more
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl text-gray-300 mb-4">📝</div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No articles yet</h3>
                  <p className="text-gray-500">We haven't published any articles in this category yet. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-4/12 space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About {category.name}</h2>
                <p className="text-gray-700 mb-4">{category.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Last updated: {formatDate(new Date().toISOString())}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscribe to Updates</h2>
                <p className="text-gray-700 mb-4">Get the latest posts in {category.name} delivered right to your inbox.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  <button className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Explore Categories</h2>
                <div className="space-y-2">
                  {['Technology', 'Finance', 'Travel', 'Luxury', 'Lifestyle'].map(cat => (
                    <Link
                      key={cat}
                      to={`/category/${cat.toLowerCase()}`}
                      className={`block py-2 px-3 rounded-md transition-colors ${
                        cat.toLowerCase() === slug.toLowerCase() 
                          ? 'bg-gray-200 text-gray-900 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;