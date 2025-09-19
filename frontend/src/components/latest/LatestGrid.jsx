import React from "react";
import BlogCard from "../blog/BlogCard";
import { allPosts } from "../../Data/posts";

const LatestGrid = () => {
  // Get the 6 most recent posts
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, 6);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestGrid;