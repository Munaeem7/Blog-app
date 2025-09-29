import React from "react";
import { Routes, Route  , useLocation} from "react-router-dom";
import Home from "./Pages/Home";
import BlogPost from "./Pages/BlogPost";
import CategoryPage from "./Pages/CategoryPage";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLogin from "./components/Admin/AdminLogin";
import ProtectedRoute from "./components/ProtectRoute";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Navbar/Footer/Footer";

const App = () => {
  const location = useLocation();
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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        

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
      {!hideLayout &&<Footer />}
    </div>
  );
};

export default App;
