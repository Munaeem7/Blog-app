// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogEditor from "../components/Admin/BlogEditor";
import CategoryManager from "../components/Admin/CategoryManager";
import ContactSubmissions from "../components/Admin/ContactSubmissions"; // We'll create this
import { useAuthStore } from "../store/auth.jsx";
import {
  FiTag,
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiSettings,
  FiUsers,
  FiBarChart,
  FiLogOut,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";
import { postsAPI, categoriesAPI } from "../Api/Api.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout, user } = useAuthStore();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalComments: 0,
    unreadMessages: 0,
  });

  // Mock current user (replace with actual auth)
  const currentUser = {
    id: 1,
    username: "admin",
    email: "admin@wealthymiles.com",
  };

  // Effect for fetching posts and stats
  useEffect(() => {
    if (activeSection === "dashboard" || activeSection === "posts") {
      fetchPosts();
      fetchStats();
    }
  }, [activeSection]);

  // Effect for fetching categories
  useEffect(() => {
    if (activeSection === "editor" || activeSection === "categories") {
      fetchCategories();
    }
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAll(1, 50);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await postsAPI.getAll(1, 1000);
      const allPosts = response.data.data;

      const totalPosts = allPosts.length;
      const publishedPosts = allPosts.filter((post) => post.published).length;
      const totalViews = allPosts.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );

      // Mock unread messages count - replace with actual API call
      const unreadMessages = 3; // This should come from your contact API

      setStats({
        totalPosts,
        publishedPosts,
        totalViews,
        totalComments: 0,
        unreadMessages,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (postData) => {
    try {
      setEditingPost(null); // Clear editing state after saving
      setActiveSection("posts"); // Navigate back to posts view
      return { success: true };
    } catch (error) {
      console.error("Error handling post save:", error);
      return { success: false, error: error.message };
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setActiveSection("editor"); // This will trigger the useEffect for categories
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setLoading(true);
      await postsAPI.delete(postId);
      await fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = () => {
    setEditingPost(null); // Set editing to null for a new post
    setActiveSection("editor"); // This will trigger the useEffect for categories
  };

  // Loading components
  const LoadingSpinner = ({ size = "medium" }) => (
    <div className="flex justify-center items-center py-8">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-600 ${
          size === "small"
            ? "h-6 w-6"
            : size === "large"
            ? "h-12 w-12"
            : "h-8 w-8"
        }`}
      ></div>
    </div>
  );

  const LoadingSkeleton = ({ type = "card", count = 1 }) => {
    const skeletons = Array.from({ length: count }, (_, i) => i);
    if (type === "card") {
      return (
        <div className="space-y-4">
          {skeletons.map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="flex space-x-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (type === "table") {
      return (
        <div className="space-y-3">
          {skeletons.map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg animate-pulse"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      );
    }
    if (type === "stats") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {skeletons.map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gray-200 rounded-lg w-12 h-12"></div>
                <div className="ml-4 flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dashboard Overview
            </h2>
            {loading ? (
              <LoadingSkeleton type="stats" count={5} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiFileText className="text-blue-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalPosts}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FiBarChart className="text-green-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.publishedPosts}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FiUsers className="text-purple-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalViews}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <FiMail className="text-yellow-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Unread Messages</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.unreadMessages}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Posts
              </h3>
              {loading ? (
                <LoadingSkeleton type="table" count={5} />
              ) : (
                <div className="space-y-3">
                  {posts.slice(0, 5).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(post.created_at).toLocaleDateString()} •
                          <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Published
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No posts yet. Create your first post!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case "editor":
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
            </div>
            {loading ? (
              <LoadingSpinner size="large" />
            ) : (
              <BlogEditor
                onSave={handleSavePost}
                categories={categories}
                initialData={editingPost}
                currentUser={currentUser}
                autoPublish={true}
              />
            )}
          </div>
        );
      case "posts":
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Posts</h2>
              <button
                onClick={handleNewPost}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
              >
                <FiPlusCircle className="mr-2" />
                New Post
              </button>
            </div>
            {loading ? (
              <LoadingSkeleton type="card" count={6} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr
                          key={post.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {post.excerpt}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {post.category_name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Published
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditPost(post)}
                                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <FiEdit className="inline mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                              >
                                <FiTrash2 className="inline mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No posts found. Create your first post!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      case "categories":
        return (
          <div className="p-6">
            {loading ? <LoadingSpinner size="large" /> : <CategoryManager />}
          </div>
        );
      case "messages":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Submissions
            </h2>
            {loading ? (
              <LoadingSpinner size="large" />
            ) : (
              <ContactSubmissions />
            )}
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            {loading ? (
              <LoadingSkeleton type="card" count={2} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Blog Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Name
                    </label>
                    <input
                      type="text"
                      defaultValue="WealthyMiles"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      defaultValue="A blog about luxury, finance, and lifestyle"
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-white text-gray-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 font-semibold">
              WM
            </span>
            {user?.name || "Admin"}
          </h1>
        </div>
        <nav className="mt-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: FiHome },
            { id: "editor", label: "Editor", icon: FiFileText },
            { id: "posts", label: "All Posts", icon: FiFileText },
            { id: "categories", label: "Categories", icon: FiTag },
            { 
              id: "messages", 
              label: "Messages", 
              icon: FiMail,
              badge: stats.unreadMessages > 0 ? stats.unreadMessages : null
            },
            { id: "settings", label: "Settings", icon: FiSettings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors relative ${
                activeSection === item.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="mr-3" />
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4 transition-colors"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "editor" && "Post Editor"}
                {activeSection === "posts" && "Manage Posts"}
                {activeSection === "categories" && "Categories"}
                {activeSection === "messages" && "Contact Messages"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">A</span>
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;