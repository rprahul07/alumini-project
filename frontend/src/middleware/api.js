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

// Fetch CSRF token with caching
const fetchCsrfToken = async () => {
  try {
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

// Handle API response
const handleApiResponse = (response) => {
  if (response.data.success === false) {
    throw new Error(response.data.message || 'API request failed');
  }
  return response.data;
};

// Add request interceptor for CSRF token
api.interceptors.request.use(
  async (config) => {
    if (config.method !== 'get') {
      const token = await fetchCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  login: async (credentials) => {
    if (!credentials.email || !credentials.password || !credentials.role) {
      throw new Error("Email, password, and role are required");
    }

    const data = {
      ...credentials,
      role: credentials.role.toLowerCase()
    };

    const response = await api.post("/api/auth/login", data);
    return handleApiResponse(response);
  },

  register: async (userData) => {
    const validationErrors = validateForm(userData, "register", userData.role);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error(Object.values(validationErrors).join(". "));
    }

    const data = {
      ...userData,
      role: userData.role.toLowerCase()
    };

    const response = await api.post("/api/auth/register", data);
    return handleApiResponse(response);
  },

  logout: async () => {
    const response = await api.post("/api/auth/logout");
    return handleApiResponse(response);
  },

  checkAuth: async () => {
    const response = await api.get("/api/auth/check");
    return handleApiResponse(response);
  }
};

// User Profile APIs
const profileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get("/api/student/profile");
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData) => {
    try {
      // If profileData is FormData (contains file), don't set Content-Type
      const config = profileData instanceof FormData ? {} : {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await api.put("/api/profile", profileData, config);
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  uploadProfilePhoto: async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append('profilePhoto', photoFile);

      const response = await api.post("/api/profile/photo", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload profile photo');
    }
  },

  deleteProfilePhoto: async () => {
    try {
      const response = await api.delete("/api/profile/photo");
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete profile photo');
    }
  }
};

// Export API services
const apiService = {
  auth: authAPI,
  profile: profileAPI,
  raw: api
};

export { authAPI, profileAPI };
export default apiService;
