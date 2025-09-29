import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { categoriesAPI } from "../../Api/Api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesAPI.getAll();
        
        // Handle different possible response structures
        let categoriesData = [];
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          categoriesData = response.data;
        } else if (response.data && Array.isArray(response.data.categories)) {
          // If response.data has a categories property that is an array
          categoriesData = response.data.categories;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that is an array
          categoriesData = response.data.data;
        }
        
        console.log("Categories data:", categoriesData); // Debug log
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-3xl sm:text-2xl font-bold text-gray-900"
          >
            <span className="bg-gray-900 text-white rounded-md w-10 h-10 flex items-center justify-center mr-3">
              WM
            </span>
            WealthyMiles
          </Link>
          <div className="text-gray-600">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center text-3xl sm:text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-200"
        >
          <span className="bg-gray-900 text-white rounded-md w-10 h-10 flex items-center justify-center mr-3 hover:bg-gray-700 transition-colors duration-200">
            WM
          </span>
          WealthyMiles
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 text-gray-600 font-medium text-lg">
          {Array.isArray(categories) && categories.map((cat) => (
            <li key={cat.id || cat._id}>
              <NavLink
                to={`/category/${cat.slug}`}
                onClick={() => window.scrollTo(0, 0)}
                className={({ isActive }) =>
                  isActive
                    ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "hover:text-gray-900 transition-all duration-200 hover:scale-105 hover:font-semibold"
                }
              >
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <div className="hidden lg:flex items-center">
          <Link
            to="/subscribe"
            className="bg-black text-white px-6 py-2 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
            onClick={() => window.scrollTo(0, 0)}
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 lg:hidden transition-all duration-200 hover:scale-110"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="text-3xl transition-transform duration-200">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-100">
          <ul className="space-y-2 text-base font-medium text-gray-600">
            {Array.isArray(categories) && categories.map((cat) => (
              <li key={cat.id || cat._id}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={handleCategoryClick}
                  className="block py-3 px-4 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200 hover:translate-x-2 hover:font-semibold"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/contact"
              onClick={handleCategoryClick}
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 relative overflow-hidden group"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;