// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState({
    name: "Category Name",
    description: "This is a description for the category. Admin can update this text.",
    imageUrl: "/images/category-header.jpg",
  });
  const [posts, setPosts] = useState([
    // dummy; replace with API data
    {
      id: 1,
      title: "Sample Blog Post One",
      excerpt: "A brief summary of blog post one...",
      slug: "sample-blog-post-one",
      date: "Sep 12, 2025",
      imageUrl: "/images/post1.jpg",
    },
    {
      id: 2,
      title: "Sample Blog Post Two",
      excerpt: "A brief summary of blog post two...",
      slug: "sample-blog-post-two",
      date: "Sep 10, 2025",
      imageUrl: "/images/post2.jpg",
    },
    // ...
  ]);

  useEffect(() => {
    // fetch category info & posts
    // axios.get(`/api/categories/${slug}`).then(res => setCategory(res.data));
    // axios.get(`/api/categories/${slug}/posts`).then(res => setPosts(res.data));
  }, [slug]);

  return (
    <main className="bg-white text-gray-900">
      <header
        className="h-64 bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${category.imageUrl})` }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-6">
            <h1 className="text-4xl font-bold text-white">{category.name}</h1>
            <p className="mt-2 text-lg text-gray-200">{category.description}</p>
          </div>
        </div>
      </header>

      <section className="max-w-screen-xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {posts.map(post => (
            <article key={post.id} className="flex flex-col md:flex-row group">
              <Link
                to={`/blogs/${post.slug}`}
                className="block md:w-1/3 h-48 bg-gray-200 rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover" }}
              />
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <Link to={`/blogs/${post.slug}`} className="text-2xl font-semibold text-gray-900 hover:text-indigo-600 transition">
                  {post.title}
                </Link>
                <p className="mt-2 text-gray-700">{post.excerpt}</p>
                <time className="mt-3 block text-sm text-gray-500">{post.date}</time>
              </div>
            </article>
          ))}
        </div>
        <aside className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">About {category.name}</h2>
            <p className="text-gray-700">{category.description}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Subscribe</h2>
            <p className="text-gray-700 mb-4">Get the latest posts delivered right to your inbox.</p>
            <Link
              to="/subscribe"
              className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Subscribe
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default CategoryPage;
