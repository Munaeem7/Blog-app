import { create } from "zustand";
import api from "../Api/Api"; // your axios instance with withCredentials: true

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // check if JWT is valid and get user
  fetchUser: async () => {
    try {
      const res = await api.get("/api/admin/check");
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  },

  // after login success
  setUser: (user) => set({ user }),

  // logout
  logout: async () => {
    try {
      await api.post("/api/admin/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null });
    }
  },
}));
