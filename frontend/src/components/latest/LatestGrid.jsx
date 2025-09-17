import React from "react";
import BlogCard from "../blog/BlogCard";

const latestPosts = [
  {
    id: 1,
    title: "Eco-Friendly Travel Tips",
    slug: "eco-travel-tips",
    excerpt: "Learn how to travel sustainably with these eco-friendly tips for your next adventure.",
    author: "Jane Doe",
    publishedDate: "2025-09-15",
    category: "Travel",
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
    category: "Finance",
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
    category: "Technology",
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
    category: "Luxury",
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
    category: "Travel",
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
    category: "Finance",
    imageUrl: "/images/investment-strategies.jpg",
    readTime: "7 min read",
  },
];

const LatestGrid = () => (
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

export default LatestGrid;
