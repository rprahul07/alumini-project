import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../middleware/api';
import { getErrorMessage } from '../utils/errorHandling';
import { profileAPI } from '../middleware/api';

// Create AuthContext to share auth info across app
const AuthContext = createContext();

// Key for storing user role in localStorage
const USER_ROLE_KEY = 'userRole';

// Custom hook to use auth context easily
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.success) {
          const storedRole = localStorage.getItem(USER_ROLE_KEY);
          
          // Fetch complete profile data
          try {
            const profileResponse = await profileAPI.getProfile();
            if (profileResponse.success) {
              const userWithProfile = {
                ...response.data,
                ...profileResponse.data,
                role: storedRole || response.data.role
              };
              setUser(userWithProfile);
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Still set user with basic data if profile fetch fails
            const userWithRole = { ...response.data, role: storedRole || response.data.role };
            setUser(userWithRole);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        localStorage.removeItem(USER_ROLE_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext - Login attempt with role:', data.role);
      const response = await authAPI.login(data);
      console.log('AuthContext - Login response:', response);
      
      if (response.success) {
        console.log('AuthContext - Setting role in localStorage:', data.role.toLowerCase());
        localStorage.setItem(USER_ROLE_KEY, data.role.toLowerCase());
        
        // Fetch complete profile data after login
        try {
          const profileResponse = await profileAPI.getProfile();
          console.log('AuthContext - Profile response:', profileResponse);
          
          if (profileResponse.success) {
            const userWithProfile = {
              ...response.data,
              ...profileResponse.data,
              role: data.role.toLowerCase()
            };
            console.log('AuthContext - Setting user with profile:', userWithProfile);
            setUser(userWithProfile);
            return { success: true, data: userWithProfile };
          }
        } catch (profileError) {
          console.error('AuthContext - Profile fetch error:', profileError);
          // Still set user with basic data if profile fetch fails
          const userWithRole = { ...response.data, role: data.role.toLowerCase() };
          console.log('AuthContext - Setting user with basic data:', userWithRole);
          setUser(userWithRole);
          return { success: true, data: userWithRole };
        }
      }
      return response;
    } catch (err) {
      console.error('AuthContext - Login error:', err);
      setError(getErrorMessage(err).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const response = await authAPI.logout();
      if (response.success) {
        localStorage.removeItem(USER_ROLE_KEY);
        setUser(null);
        setError(null);
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      localStorage.removeItem(USER_ROLE_KEY);
      setUser(null);
      setError(getErrorMessage(err).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      return response;
    } catch (err) {
      setError(getErrorMessage(err).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user role from state or localStorage
  const role = user?.role || localStorage.getItem(USER_ROLE_KEY) || null;
  console.log('AuthContext - Current role:', role);
  console.log('AuthContext - Current user:', user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        error,
        login,
        logout,
        register,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
