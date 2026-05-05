import axios from 'axios';

const RAW_API_URL = 'http://localhost:5000/api';
// Ensure the base URL always ends with `/api` (Render injects RENDER_EXTERNAL_URL without it)
const API_URL = /\/api\/?$/.test(RAW_API_URL)
  ? RAW_API_URL.replace(/\/$/, '')
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Handle connection errors
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.error('Backend server is not running. Please start the backend server.');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  adminLogin: (data: any) => api.post('/auth/admin/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

export const destinationAPI = {
  getAll: (params?: any) => api.get('/destinations', { params }),
  getById: (id: string) => api.get(`/destinations/${id}`),
  getPopular: () => api.get('/destinations/popular'),
  getFeatured: () => api.get('/destinations/featured'),
  getByCategory: (category: string) => api.get(`/destinations/category/${category}`),
  getCategories: () => api.get('/destinations/categories'),
  getCountries: () => api.get('/destinations/countries'),
  create: (data: any) => api.post('/destinations', data),
  update: (id: string, data: any) => api.put(`/destinations/${id}`, data),
  delete: (id: string) => api.delete(`/destinations/${id}`),
};

export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: (params?: any) => api.get('/bookings/my-bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string, data: any) => api.put(`/bookings/${id}/cancel`, data),
  getAll: (params?: any) => api.get('/bookings/all', { params }),
  updateStatus: (id: string, data: any) => api.put(`/bookings/${id}/status`, data),
  getStats: () => api.get('/bookings/stats'),
};

export const itineraryAPI = {
  create: (data: any) => api.post('/itineraries', data),
  generateAI: (data: any) => api.post('/itineraries/ai-generate', data),
  getMyItineraries: (params?: any) => api.get('/itineraries/my-itineraries', { params }),
  getById: (id: string) => api.get(`/itineraries/${id}`),
  update: (id: string, data: any) => api.put(`/itineraries/${id}`, data),
  delete: (id: string) => api.delete(`/itineraries/${id}`),
  addDay: (id: string, data: any) => api.post(`/itineraries/${id}/days`, data),
  updateDay: (id: string, data: any) => api.put(`/itineraries/${id}/days`, data),
};

export const paymentAPI = {
  process: (data: any) => api.post('/payments/process', data),
  getMyPayments: (params?: any) => api.get('/payments/my-payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  refund: (data: any) => api.post('/payments/refund', data),
  getAll: (params?: any) => api.get('/payments/all', { params }),
  getStats: () => api.get('/payments/stats'),
};

export const reviewAPI = {
  create: (data: any) => api.post('/reviews', data),
  getByDestination: (destinationId: string, params?: any) =>
    api.get(`/reviews/destination/${destinationId}`, { params }),
  getMyReviews: (params?: any) => api.get('/reviews/my-reviews', { params }),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  markHelpful: (id: string) => api.post(`/reviews/${id}/helpful`),
  getAll: (params?: any) => api.get('/reviews/all', { params }),
  adminResponse: (id: string, data: any) => api.post(`/reviews/${id}/admin-response`, data),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  blockUser: (id: string) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id: string) => api.put(`/admin/users/${id}/unblock`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

export const reportAPI = {
  create: (data: any) => api.post('/reports', data),
  getMyReports: (params?: any) => api.get('/reports/my-reports', { params }),
  getById: (id: string) => api.get(`/reports/${id}`),
  addResponse: (id: string, data: any) => api.post(`/reports/${id}/response`, data),
  getAll: (params?: any) => api.get('/reports/all', { params }),
  updateStatus: (id: string, data: any) => api.put(`/reports/${id}/status`, data),
  addAdminResponse: (id: string, data: any) => api.post(`/reports/${id}/admin-response`, data),
};

export const aiAPI = {
  getRecommendations: () => api.get('/ai/recommendations'),
};

export default api;
