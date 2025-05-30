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

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add request interceptor to include CSRF token
api.interceptors.request.use(
  async (config) => {
    try {
      const response = await axios.get("http://localhost:5001/api/csrf-token", {
        withCredentials: true,
      });
      config.headers["X-CSRF-Token"] = response.data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  checkAuth: async () => {
    try {
      const response = await api.get("/api/auth/check");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "An unexpected error occurred"
      );
    }
  },

  login: async (credentials) => {
    try {
      const loginData = {
        role: credentials.role,
        email: credentials.email,
        password: credentials.password,
      };
      const response = await api.post("/api/auth/login", loginData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Invalid credentials. Please try again."
      );
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.status === 400) {
        throw new Error(
          "Registration failed. Please check your information and try again."
        );
      } else if (error.response?.status === 409) {
        throw new Error(
          "Email already exists. Please use a different email address."
        );
      } else if (error.response?.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
      throw new Error("An unexpected error occurred. Please try again.");
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Logout failed. Please try again."
      );
    }
  },

  googleAuth: async (token) => {
    try {
      const response = await api.post("/api/auth/google", { token });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          "Google sign-in failed. Please try again."
      );
    }
  },
};

// User Profile APIs
export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/api/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "An unexpected error occurred"
      );
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "An unexpected error occurred"
      );
    }
  },
};

// Add response interceptor to handle CSRF token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 419) {
      // CSRF token mismatch
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const apiService = {
  auth: authAPI,
  profile: profileAPI,
};

export default apiService;
