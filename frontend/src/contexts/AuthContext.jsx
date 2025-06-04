import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../middleware/api';
import { getErrorMessage } from '../utils/errorHandling';

const AuthContext = createContext();

const AUTH_TOKEN_KEY = 'token';
const USER_ROLE_KEY = 'userRole';

// Separate useAuth hook into a named function for better HMR compatibility
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      console.log('Checking auth - Token:', token ? 'exists' : 'not found');
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await authAPI.checkAuth();
      console.log('Auth check response:', response);
      
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error('Authentication check failed');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      setUser(null);
      const errorResponse = getErrorMessage(error);
      setError(errorResponse.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      console.log('Login attempt with role:', data.role);
      const response = await authAPI.login(data);
      console.log('Login response:', response);

      if (response.success) {
        // Store both token and role
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_ROLE_KEY, data.role.toLowerCase());
        console.log('Stored auth data - Role:', data.role.toLowerCase());
        
        setUser(response.data);
        setError(null);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      const errorResponse = getErrorMessage(error);
      setError(errorResponse.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await authAPI.logout();
      if (response.success) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_ROLE_KEY);
        setUser(null);
        setError(null);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      const errorResponse = getErrorMessage(error);
      // Still remove user data even if logout API fails
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      setUser(null);
      setError(errorResponse.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response;
    } catch (error) {
      const errorResponse = getErrorMessage(error);
      setError(errorResponse.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 