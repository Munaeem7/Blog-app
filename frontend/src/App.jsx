import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// FIX: Added .jsx extension to all local component imports to resolve compilation errors
import Home from "./Pages/Home.jsx";
import BlogPost from "./Pages/BlogPost.jsx";
import CategoryPage from "./Pages/CategoryPage.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectRoute.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Navbar/Footer/Footer.jsx";
import Contact from "./Pages/Contact.jsx";
import AboutUs from "./Pages/About.jsx";

const App = () => {
  const location = useLocation();
  const GA_TRACKING_ID = 'G-D0PK2YETP5';

  // useEffect to track page view whenever the route changes
  useEffect(() => {
    // Check if the gtag function is globally available (loaded from index.html)
    if (window.gtag) {
      // Send a manual page_view event to Google Analytics
      window.gtag('event', 'page_view', {
        page_title: document.title, 
        page_path: location.pathname + location.search,
        send_to: GA_TRACKING_ID // Ensure the event is sent to your specific property
      });
      // Optionally log to console for debugging
      console.log(`GA tracked page view: ${location.pathname}`);
    }
  }, [location.pathname, location.search]); // Depend on location changes

  const hideLayout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");
  
  return (
    <div className="min-h-screen">
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route
          path="/category/:categorySlug/:postSlug"
          element={<BlogPost />}
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
