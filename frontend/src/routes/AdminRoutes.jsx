import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLogin from '../layouts/AdminLogin';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import EditUserPage from '../components/dashboard/EditUserPage';
import EditEvent from '../components/EditEvent';
import { useAuth } from '../contexts/AuthContext'; // ✅ Add AuthContext


const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // ✅ Use AuthContext
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
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