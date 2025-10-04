// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/auth";
import { motion } from "framer-motion"; // Import motion

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state
  const { setUser } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Set loading to true on form submit

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUser(res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 border border-gray-200"
        >
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}
          {/* Email */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-900 transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-t-white border-transparent rounded-full"
              ></motion.div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}