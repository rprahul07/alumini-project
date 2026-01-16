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
  // OPTIMISTIC AUTH INITIALIZATION:
  // Initialize user state directly from localStorage to prevent "blank screen" or "logged out flash"
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  });

  // Initialize selectedRole from localStorage
  const [selectedRole, setSelectedRoleState] = useState(() => localStorage.getItem(SELECTED_ROLE_KEY) || '');

  // Loading is strictly for "initial check" or "login/logout actions".
  // If we have a stored user, we are NOT loading, we are just "verifying in background".
  const [loading, setLoading] = useState(() => {
    const hasStoredUser = localStorage.getItem('user');
    // If user exists in localStorage, we assume they are logged in (Optimistic), so loading is FALSE.
    // If no user, we are Guest, so loading is FALSE.
    // Ideally, we want the app to be responsive instantly.
    return false;
  });

  const [error, setError] = useState(null);

  // Helper to set selectedRole in state and localStorage
  const setSelectedRole = (role) => {
    setSelectedRoleState(role);
    localStorage.setItem(SELECTED_ROLE_KEY, role);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Optimistic check: We already set initial state from localStorage.
        // Now we just verify the token in the background.

        const hasStoredUser = localStorage.getItem('user');
        const hasStoredRole = localStorage.getItem(USER_ROLE_KEY) || localStorage.getItem('userRole');

        // If absolutely no data, ensure state is clean
        if (!hasStoredUser && !hasStoredRole) {
          if (user !== null) setUser(null);
          return;
        }

        // Validate session with backend
        const response = await authAPI.checkAuth();

        if (response.success) {
          const storedRole = localStorage.getItem(USER_ROLE_KEY);
          const role = storedRole || response.data.role;

          // Merge backend data with existing optimistic data to prevent flicker
          const basicUser = {
            ...response.data,
            role: role
          };

          // Only update state if data changed to avoid re-renders
          setUser(prev => {
            // Simple equality check to avoid redundant updates
            if (JSON.stringify(prev) !== JSON.stringify(basicUser)) {
              return basicUser;
            }
            return prev;
          });

          // Fetch full profile in background
          try {
            const profileResponse = await profileAPI.getProfile(role);
            if (profileResponse.success) {
              const userWithProfile = {
                ...basicUser,
                ...(profileResponse.data || {}),
              };
              // Update user state with full profile data
              setUser(userWithProfile);
            }
          } catch (profileError) {
            console.error('Error fetching profile in background:', profileError);
          }

        } else {
          // Token invalid? Logout.
          console.warn('Session verification failed, logging out.');
          handleSilentLogout();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        handleSilentLogout();
      }
    };

    checkAuth();
  }, []);

  const handleSilentLogout = () => {
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem(SELECTED_ROLE_KEY);
    setUser(null);
    setLoading(false);
  };

  // Login function
  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('selectedRole');
      localStorage.removeItem('userRole');

      const loginRole = data.role || selectedRole;
      const response = await authAPI.login({ ...data, role: loginRole });

      if (response.success) {
        const userObj = response.user || response.data?.user || response.data?.data || response.data;
        const backendRole = (userObj.role || loginRole).toLowerCase();

        // Optimistic update
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('role', backendRole);
        localStorage.setItem('selectedRole', backendRole);
        localStorage.setItem('userRole', backendRole);
        setSelectedRole(backendRole);

        const userWithRole = { ...userObj, role: backendRole };
        setUser(userWithRole);

        // Background fetch - FIRE AND FORGET (don't await)
        // This allows the UI to redirect IMMEDIATELY
        profileAPI.getProfile(backendRole).then(profileResponse => {
          if (profileResponse.success) {
            const userWithProfile = {
              ...userObj,
              ...(profileResponse.data || {}),
              role: backendRole
            };
            setUser(userWithProfile);
          }
        }).catch(err => {
          console.error('Background profile fetch failed:', err);
          // We still have the basic user, so no need to do anything drastic
        });

        return { success: true, data: userWithRole };
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
    // OPTIMISTIC LOGOUT: Clear state immediately
    handleSilentLogout();

    // Send request to backend to clear cookie, but don't wait for UI update
    authAPI.logout().catch(err => {
      console.error('Logout API error:', err);
    });
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

  // Helper function to check if user is admin
  const isAdmin = () => {
    const userRole = user?.role?.toLowerCase();
    const computedRole = role?.toLowerCase();
    return userRole === 'admin' || computedRole === 'admin';
  };

  const canManageGallery = () => isAdmin();

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
        isAdmin,
        canManageGallery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
