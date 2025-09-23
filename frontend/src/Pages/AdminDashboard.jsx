import React, { useState, useEffect } from "react";
import BlogEditor from "../components/Admin/BlogEditor";
import { FiTag } from "react-icons/fi";
import CategoryManager from "../components/Admin/CategoryManager";
import {
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
} from "react-icons/fi";
import { postsAPI, categoriesAPI } from "../Api/Api.jsx";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("editor");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showNewEditor, setShowNewEditor] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
  });

  // Mock current user (replace with actual auth)
  const currentUser = {
    id: 1,
    username: "admin",
    email: "admin@wealthymiles.com",
  };

useEffect(() => {
  if (activeSection === 'dashboard' || activeSection === 'posts') {
    fetchPosts();
    fetchStats();
  }
  
  if (activeSection === 'editor' || activeSection === 'categories') {
    fetchCategories();
  }
}, [activeSection]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(1, 50); // Get first 50 posts
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // This would be a custom endpoint you'd need to create
      // For now, we'll calculate from posts data
      const response = await postsAPI.getAll(1, 1000); // Get all posts for stats
      const allPosts = response.data.data;

      const totalPosts = allPosts.length;
      const publishedPosts = allPosts.filter((post) => post.published).length;
      const draftPosts = totalPosts - publishedPosts;
      const totalViews = allPosts.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );

      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        totalComments: 0, // You'd need to fetch comments separately
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSavePost = async (postData) => {
    try {
      // The actual save happens in the BlogEditor component
      // This function just updates the UI after success
      await fetchPosts();
      setShowNewEditor(false);
      setEditingPost(null);

      return { success: true };
    } catch (error) {
      console.error("Error handling post save:", error);
      return { success: false, error: error.message };
    }
  };

  const handlePublishPost = async (postData) => {
    try {
      await fetchPosts();
      setShowNewEditor(false);
      setEditingPost(null);

      return { success: true };
    } catch (error) {
      console.error("Error handling post publish:", error);
      return { success: false, error: error.message };
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowNewEditor(true);
    setActiveSection("editor");
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postsAPI.delete(postId);
      await fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setShowNewEditor(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dashboard Overview
            </h2>
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
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FiFileText className="text-yellow-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.draftPosts}
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
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Posts
              </h3>
              {loading ? (
                <p className="text-gray-500 text-center py-8">
                  Loading posts...
                </p>
              ) : (
                <div className="space-y-3">
                  {posts.slice(0, 5).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(post.created_at).toLocaleDateString()} •
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              post.published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
              {!showNewEditor && (
                <button
                  onClick={handleNewPost}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FiPlusCircle className="mr-2" />
                  New Post
                </button>
              )}
            </div>
            {showNewEditor && (
              <BlogEditor
                onSave={handleSavePost}
                onPublish={handlePublishPost}
                categories={categories}
                initialData={editingPost}
                currentUser={currentUser}
              />
            )}
          </div>
        );

      case "posts":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manage Posts
            </h2>
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading posts...</p>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.excerpt}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {post.category_name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              post.published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
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
            )}
          </div>
        );
      case "categories":
        return (
          <div className="p-6">
            <CategoryManager />
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue="A blog about luxury, finance, and lifestyle"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
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
            <span className="bg-white text-gray-900 rounded-md w-8 h-8 flex items-center justify-center mr-3">
              WM
            </span>
            Admin Panel
          </h1>
        </div>
        <nav className="mt-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: FiHome },
            { id: "editor", label: "Editor", icon: FiFileText },
            { id: "posts", label: "All Posts", icon: FiFileText },
            { id: "categories", label: "Categories", icon: FiTag },
            { id: "settings", label: "Settings", icon: FiSettings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
                if (item.id === "editor") handleNewPost();
                if (item.id === 'categories') fetchCategories();
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === item.id
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button className="w-full flex items-center text-gray-300 hover:text-white">
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
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "editor" && "Post Editor"}
                {activeSection === "posts" && "Manage Posts"}
                {activeSection === "settings" && "Settings"}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">A</span>
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
