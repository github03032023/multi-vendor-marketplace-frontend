// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: 'https://multi-vendor-marketplace-backend.onrender.com/api/auth', // adjust as needed
  // baseURL: 'http://localhost:5000/api/auth', // adjust as needed
});

// Add token from localStorage
const token = localStorage.getItem('token');
console.log("Authorization Token is -",token);
if (token) {
  console.log("Inside if -",token);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axiosInstance;
