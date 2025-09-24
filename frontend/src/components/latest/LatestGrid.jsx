import React, { useEffect, useState } from "react";
import BlogCard from "../blog/BlogCard";
import { postsAPI } from "../../Api/Api";

const LatestGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch posts from API
        const { data } = await postsAPI.getAll(1, 6);

        if (!data.success) {
          throw new Error("Failed to fetch posts");
        }

        // Map database fields to frontend structure
        const mappedPosts = data.data.map((dbPost) => ({
          id: dbPost.id,
          title: dbPost.title,
          slug: dbPost.slug,
          excerpt: dbPost.excerpt,
          author: dbPost.author || "Admin",
          publishedDate: dbPost.created_at,
          category: dbPost.category_name, 
          imageUrl: dbPost.cover_image || "/img1.webp",
          readTime: dbPost.read_time || "5 min read",
          content: dbPost.content,
        }));

        // Sort by date (most recent first) and take only 6
        const latestPosts = mappedPosts
          .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
          .slice(0, 6);

        setPosts(latestPosts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
        setError("Failed to load latest articles");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading skeleton */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="text-center py-16">
            <div className="text-5xl text-gray-300 mb-4">📰</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Unable to load articles
            </h3>
            
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl text-gray-300 mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No articles available
            </h3>
            <p className="text-gray-500">
              Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestGrid;
