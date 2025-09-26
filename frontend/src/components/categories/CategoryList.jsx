import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI } from "../../Api/Api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAll();
        
        // Handle different possible response structures (same as Navbar)
        let categoriesData = [];
        
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data && Array.isArray(response.data.categories)) {
          categoriesData = response.data.categories;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        }

        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="block p-6 bg-gray-100 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(categories) && categories.map(cat => (
            <Link
              key={cat.id || cat._id}
              to={`/category/${cat.slug}`}
              onClick={() => window.scrollTo(0, 0)}
              className="block p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-200 group"
            >
              <h3 className="text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                View all articles
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;