import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define only category items 
  const categories = [
   
    "Finance",
    "Travel",
    "Business",
    "Luxury",
    "Lifestyle",
    "Health",
    "Education"
  ];

  // Function to close menu and scroll to top
  const handleCategoryClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-3xl sm:text-2xl font-bold text-gray-900">
          <span className="bg-gray-900 text-white rounded-md w-10 h-10 flex items-center justify-center mr-3">WM</span>
          WealthyMiles
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex space-x-8 text-gray-600 font-medium text-lg">
          {categories.map(cat => (
            <li key={cat}>
              <NavLink
                to={`/category/${cat.toLowerCase()}`}
                onClick={() => window.scrollTo(0, 0)}
                className={({ isActive }) =>
                  isActive
                    ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                    : "hover:text-gray-900 transition-colors duration-200"
                }
              >
                {cat}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center">
          <Link
            to="/subscribe"
            className="bg-black text-white px-6 py-2 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
            onClick={() => window.scrollTo(0, 0)}
          >
            Subscribe
          </Link>
        </div>

        {/* Mobile Toggle - Improved accessibility */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="text-3xl">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu - Improved accessibility */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-100">
          <ul className="space-y-2 text-base font-medium text-gray-600">
            {categories.map(cat => (
              <li key={cat}>
                <Link
                  to={`/category/${cat.toLowerCase()}`}
                  onClick={handleCategoryClick}
                  className="block py-3 px-4 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/subscribe"
              onClick={handleCategoryClick}
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
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