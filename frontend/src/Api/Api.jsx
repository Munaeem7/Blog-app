import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true 
});

// API methods
export const postsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/api/v1/allposts?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/api/v1/post/${id}`),
  create: (postData) => api.post('/api/v1/post', postData),
  update: (id, postData) => api.put(`/api/v1/post/${id}`, postData),
  delete: (id) => api.delete(`/api/v1/post/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/api/v1/categories'),
  getOne: (id) => api.get(`/api/v1/categories/${id}`),
  create: (categoryData) => api.post('/api/v1/categories', categoryData),
  update: (id, categoryData) => api.put(`/api/v1/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/api/v1/categories/${id}`),
};
export const contactAPI = {
  // Create new contact submission
  create: (contactData) => api.post('/api/contact', contactData),
  getAll: (page = 1, limit = 10, status = 'all') => 
    api.get(`/api/contact?page=${page}&limit=${limit}&status=${status}`),
  getOne: (id) => api.get(`/api/contact/${id}`),
  updateStatus: (id, status) => api.put(`/api/contact/${id}`, { status }),
  delete: (id) => api.delete(`/api/contact/${id}`),
  getStats: () => api.get('/api/contact/stats/summary'),
};

export default api;