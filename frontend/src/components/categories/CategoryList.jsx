import React from "react";
import { Link } from "react-router-dom";

const dummyCategories = [
  { id: 1, name: "Technology", slug: "technology" },
  { id: 2, name: "Finance", slug: "finance" },
  { id: 3, name: "Travel", slug: "travel" },
  { id: 4, name: "Business", slug: "business" },
  { id: 5, name: "Luxury", slug: "luxury" },
  { id: 6, name: "Lifestyle", slug: "lifestyle" },
  { id: 7, name: "Health", slug: "health" },
  { id: 8, name: "Education", slug: "education" },
];

const CategoryList = ({ categories = dummyCategories }) => (
  <section className="py-16 bg-white">
    <div className="max-w-screen-xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            onClick={() => window.scrollTo(0, 0)}
            className="block p-6 bg-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-200 group"
          >
            <h3 className="text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">View all articles</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryList;