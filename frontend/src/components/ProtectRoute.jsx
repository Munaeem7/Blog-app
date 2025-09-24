import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import React,{ useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <Navigate to="/admin" replace />;

  return children;
}
