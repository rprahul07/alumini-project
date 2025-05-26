import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5,
  timeWindow: 60000, // 1 minute
  requests: new Map(),
};

// Rate limiting interceptor
axios.interceptors.request.use(
  (config) => {
    const now = Date.now();
    const key = `${config.url}-${config.method}`;
    const requestHistory = RATE_LIMIT.requests.get(key) || [];

    // Clean old requests
    const validRequests = requestHistory.filter(
      (time) => now - time < RATE_LIMIT.timeWindow
    );

    if (validRequests.length >= RATE_LIMIT.maxRequests) {
      return Promise.reject(
        new Error("Rate limit exceeded. Please try again later.")
      );
    }

    validRequests.push(now);
    RATE_LIMIT.requests.set(key, validRequests);
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure axios defaults
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Auth APIs
export const authAPI = {
  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await axios.get("/api/auth/check");
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "An unexpected error occurred";
      throw new Error(errorMsg);
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Invalid credentials. Please try again.";
      throw new Error(errorMsg);
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.status === 400) {
        throw new Error("Registration failed. Please check your information and try again.");
      } else if (error.response?.status === 409) {
        throw new Error("Email already exists. Please use a different email address.");
      } else if (error.response?.status === 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Logout failed. Please try again.";
      throw new Error(errorMsg);
    }
  },

  // Google OAuth
  googleAuth: async (token) => {
    try {
      const response = await axios.post("/api/auth/google", { token });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Google sign-in failed. Please try again.";
      throw new Error(errorMsg);
    }
  },
};

// User Profile APIs
export const profileAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get("/api/profile");
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "An unexpected error occurred";
      throw new Error(errorMsg);
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put("/api/profile", profileData);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "An unexpected error occurred";
      throw new Error(errorMsg);
    }
  },
};

// Error handling interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 419) {
      // CSRF token mismatch
      window.location.reload();
    } else if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default {
  auth: authAPI,
  profile: profileAPI,
};
