import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 300000 // 5 minutes timeout for file uploads
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    // JWT token is automatically sent via HTTP-only cookies
    // No need for Authorization header
    
    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    // For FormData, let axios set the Content-Type automatically with boundary
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data on unauthorized response (token handled via HTTP-only cookies)
      localStorage.removeItem('user');
      // Do NOT redirect here. Let the app handle navigation.
    }
    return Promise.reject(error);
  }
);

export default instance; 
