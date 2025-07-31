import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLogin from '../layouts/AdminLogin';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import EditUserPage from '../components/dashboard/EditUserPage';
import EditEvent from '../components/EditEvent';


const AdminProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Token handled via HTTP-only cookies, check user data
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);
        setIsAuthenticated(user.role === 'admin');
      } catch (error) {
        setIsAuthenticated(false);
        // Clear invalid user data (token handled via HTTP-only cookies)
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<AdminLogin />}
      />
      <Route
        path="/dashboard/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/edit-user/:type/:id"
        element={
          <AdminProtectedRoute>
            <EditUserPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/events/edit/:id"
        element={
          <AdminProtectedRoute>
            <EditEvent />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes; 