import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
//   withCredentials: true 
});

// Add request interceptor for authentication tokens if needed
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// API methods
export const postsAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/allposts?page=${page}&limit=${limit}`),
  getOne: (id) => api.get(`/post/${id}`),
  create: (postData) => api.post('/api/v1/post', postData),
  update: (id, postData) => api.put(`/post/${id}`, postData),
  delete: (id) => api.delete(`/post/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/api/v1/categories'),
  getOne: (id) => api.get(`/api/v1/categories/${id}`),
  create: (categoryData) => api.post('/api/v1/categories', categoryData),
  update: (id, categoryData) => api.put(`/api/v1/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/api/v1/categories/${id}`),
};



export default api;