// // src/api/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   //  baseURL: 'https://multi-vendor-marketplace-backend.onrender.com/api/auth', // adjust as needed
//   baseURL: 'http://localhost:5000/api/auth' // adjust as needed
// });

// // Add token from localStorage
// const token = localStorage.getItem('token');
// console.log("Authorization Token is -",token);
// if (token) {
//   console.log("Inside if -",token);
//   axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }


// axiosInstance.interceptors.request.use(config => {
//   console.log("Request Headers:", config.headers);
//   return config;
// });

// export default axiosInstance;



// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/api/auth' // or your deployed backend URL
  baseURL: 'https://multi-vendor-marketplace-backend.onrender.com/api/auth'
});

// Interceptor to add token before each request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Always fetch the latest token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log("Request Headers:", config.headers);
  return config;
});

export default axiosInstance;
