import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Navbar/Footer/Footer";
import BlogCard from "../components/blog/BlogCard"; 
import { categoriesAPI } from "../Api/Api";

const CategoryPage = () => {
  const { categorySlug } = useParams(); 
  const [category, setCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [posts, setPosts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories from API
        const categoriesResponse = await categoriesAPI.getAll();
        
        // Handle different response structures
        let categoriesData = [];
        
        if (Array.isArray(categoriesResponse.data)) {
          // If response.data is directly an array (your case)
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
          // If response.data has a categories property
          categoriesData = categoriesResponse.data.categories;
        } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data.data)) {
          // If response.data has a data property
          categoriesData = categoriesResponse.data.data;
        }
        
        console.log("Categories data:", categoriesData);
        setAllCategories(categoriesData || []);

        // Find the current category by slug
        const currentCategory = categoriesData.find(cat => 
          cat.slug?.toLowerCase() === categorySlug?.toLowerCase() || 
          cat.name?.toLowerCase() === categorySlug?.toLowerCase()
        );

        if (currentCategory) {
          setCategory({
            name: currentCategory.name,
            description: currentCategory.description || `Explore our latest articles and insights about ${currentCategory.name}. Stay updated with the most relevant content in this category.`,
            imageUrl: currentCategory.imageUrl || "/img1.webp",
          });
        } else {
          // Fallback if category not found
          const fallbackName = categorySlug ? 
            categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 
            "Category";
          
          setCategory({
            name: fallbackName,
            description: `Explore our latest articles and insights about ${fallbackName}. Stay updated with the most relevant content in this category.`,
            imageUrl: "/img1.webp",
          });
        }

        // For posts, you would need to fetch them from your posts API
        // This is a placeholder - replace with actual posts API call
        const filteredPosts = []; // Replace with actual posts filtering logic
        
        setPosts(filteredPosts);
      } catch (error) {
        console.error("Error fetching category data:", error);
        // Fallback data in case of error
        const fallbackName = categorySlug ? 
          categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 
          "Category";
        
        setCategory({
          name: fallbackName,
          description: `Explore our latest articles and insights about ${fallbackName}. Stay updated with the most relevant content in this category.`,
          imageUrl: "/img1.webp",
        });
        setAllCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
                <div className="grid gap-6 md:grid-cols-2">
                  {posts.map(post => (
                    <BlogCard key={post.id} post={post} />
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
                  {Array.isArray(allCategories) && allCategories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug || cat.name.toLowerCase()}`} 
                      onClick={() => window.scrollTo(0, 0)}
                      className={`block py-2 px-3 rounded-md transition-colors ${
                        (cat.slug?.toLowerCase() === categorySlug?.toLowerCase() || 
                         cat.name?.toLowerCase() === categorySlug?.toLowerCase()) 
                          ? 'bg-gray-200 text-gray-900 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
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