import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menu_items = [ "Technology", "Blogs", "Finance", "Travel", "Business", "Luxury", "Lifestyle"];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-3xl sm:text-2xl font-bold text-gray-900">
          <span className="bg-gray-900 text-white rounded-md w-10 h-10 flex items-center justify-center mr-3">LB</span>
          LuxeBlog
        </Link>

        <ul className="hidden lg:flex space-x-8 xl:space-x-10 text-gray-600 font-medium text-lg">
          {menu_items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className="hover:text-gray-900 transition-colors duration-200 py-2 relative group"
              >
                {item}
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center space-x-6">
          <Link
            to="/subscribe"
            className="bg-black text-white px-6 py-2 rounded-md font-medium text-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Subscribe
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-3xl sm:text-2xl">{isMenuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-100">
          <ul className="space-y-2 text-base sm:text-lg font-medium text-gray-600">
            {menu_items.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/subscribe"
              onClick={() => setIsMenuOpen(false)}
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
