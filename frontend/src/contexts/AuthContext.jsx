import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../middleware/api';
import { getErrorMessage } from '../utils/errorHandling';
import { profileAPI } from '../middleware/api';

// Create AuthContext to share auth info across app
const AuthContext = createContext();

// Key for storing user role in localStorage
const USER_ROLE_KEY = 'userRole';
const SELECTED_ROLE_KEY = 'selectedRole';

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
  const [selectedRole, setSelectedRoleState] = useState(() => localStorage.getItem(SELECTED_ROLE_KEY) || '');

  // Helper to set selectedRole in state and localStorage
  const setSelectedRole = (role) => {
    setSelectedRoleState(role);
    localStorage.setItem(SELECTED_ROLE_KEY, role);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.success) {
          const storedRole = localStorage.getItem(USER_ROLE_KEY);
          const role = storedRole || response.data.role;
          
          // Fetch complete profile data
          try {
            const profileResponse = await profileAPI.getProfile(role);
            if (profileResponse.success) {
              const userWithProfile = {
                ...response.data,
                ...(profileResponse.data || {}),
                role: role
              };
              setUser(userWithProfile);
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Still set user with basic data if profile fetch fails
            const userWithRole = { ...response.data, role: role };
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
      // Clear old auth data before login (token handled via HTTP-only cookies)
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('userRole');
      // Use selectedRole if not provided
      const loginRole = data.role || selectedRole;
      const response = await authAPI.login({ ...data, role: loginRole });
      if (response.success) {
        // Always extract user object from response
        const userObj = response.user || response.data?.user || response.data?.data || response.data;
        const backendRole = (userObj.role || loginRole).toLowerCase();
        // Set new auth data (token is handled securely via HTTP-only cookies)
        // localStorage.setItem('token', response.token); // REMOVED: Security vulnerability
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', backendRole);
        localStorage.setItem('selectedRole', backendRole);
        localStorage.setItem('userRole', backendRole);
        setSelectedRole(backendRole);
        // Fetch complete profile data after login
        try {
          const profileResponse = await profileAPI.getProfile(backendRole);
          if (profileResponse.success) {
            const userWithProfile = {
              ...userObj,
              ...(profileResponse.data || {}),
              role: backendRole
            };
            setUser(userWithProfile);
            return { success: true, data: userWithProfile };
          }
        } catch (profileError) {
          const userWithRole = { ...userObj, role: backendRole };
          setUser(userWithRole);
          return { success: true, data: userWithRole };
        }
      }
      return response;
    } catch (err) {
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
        // Remove all auth-related data from localStorage (token handled via HTTP-only cookies)
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('selectedRole');
        localStorage.removeItem('userRole');
        setUser(null);
        setSelectedRoleState('');
        setError(null);
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      // Ensure cleanup on error (token handled via HTTP-only cookies)
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('userRole');
      setUser(null);
      setSelectedRoleState('');
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
  const role = user?.role || localStorage.getItem(USER_ROLE_KEY) || selectedRole || null;
  console.log('AuthContext - Current role:', role);
  console.log('AuthContext - Current user:', user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        selectedRole,
        setSelectedRole,
        loading,
        error,
        login,
        logout,
        register,
        clearError: () => setError(null),
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
