import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// 🔥 Add interceptor to attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ================= AUTH =================

// Register user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);

  // 🔥 store token after register also
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check login
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// ================= PRODUCTS =================

// Get all products
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Create product
export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

// Update product
export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
