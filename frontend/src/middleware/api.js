import axios from "axios";
import { validateForm } from "../utils/validation";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

// CSRF token management
let csrfToken = null;
let tokenExpiry = null;
const TOKEN_REFRESH_INTERVAL = 3.5 * 60 * 1000; // 3.5 minutes (with buffer)

// Function to fetch CSRF token with caching
const fetchCsrfToken = async () => {
  try {
    // Return cached token if it's still valid
    if (csrfToken && tokenExpiry && Date.now() < tokenExpiry) {
      return csrfToken;
    }

    const response = await api.get('/api/csrf-token');
    
    csrfToken = response.data.csrfToken;
    tokenExpiry = Date.now() + TOKEN_REFRESH_INTERVAL;
    
    return csrfToken;
  } catch (error) {
    throw new Error('Failed to fetch CSRF token. Please try again.');
  }
};

// Utility function for API responses
const handleApiResponse = (response) => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Operation failed');
  }
  return {
    success: true,
    message: response.data.message,
    data: response.data.data
  };
};

// Add request interceptor for CSRF token and logging
api.interceptors.request.use(
  async (config) => {
    // Add CSRF token to non-GET requests
    if (config.method !== 'get') {
      const token = await fetchCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 403) {
      csrfToken = null;
      tokenExpiry = null;
      throw new Error("Session expired. Please refresh the page and try again.");
    }
    
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password.");
    }

    if (error.response?.status === 409) {
      throw new Error("This email is already registered. Please use a different email or login.");
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "An unexpected error occurred. Please try again."
    );
  }
);

// Auth API methods
const authAPI = {
  // Login method
  login: async (credentials) => {
    try {
      // Validate required fields
      if (!credentials.email || !credentials.password || !credentials.role) {
        throw new Error("Email, password, and role are required");
      }

      // Ensure role is lowercase to match backend expectations
      const data = {
        ...credentials,
        role: credentials.role.toLowerCase()
      };

      const response = await api.post("/api/auth/login", data);
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Register method
  register: async (userData) => {
    try {
      // Validate form data
      const validationErrors = validateForm(userData, "register", userData.role);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error(Object.values(validationErrors).join(". "));
      }

      // Ensure role is lowercase to match backend expectations
      const data = {
        ...userData,
        role: userData.role.toLowerCase()
      };

      const response = await api.post("/api/auth/register", data);
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Logout method
  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // Check auth status
  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/check");
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  }
};

// User Profile APIs
const profileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/api/profile");
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/profile", profileData);
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Export the API service with all methods
const apiService = {
  auth: authAPI,
  profile: profileAPI,
  // Add raw axios instance for direct use if needed
  raw: api
};

export { authAPI, profileAPI };
export default apiService;
