import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    // JWT token is automatically sent via HTTP-only cookies
    // No need for Authorization header
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
