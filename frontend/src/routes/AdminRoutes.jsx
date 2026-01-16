import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
// Lazy load admin pages for better performance
const AdminLogin = React.lazy(() => import('../layouts/AdminLogin'));
const AdminDashboard = React.lazy(() => import('../pages/dashboards/AdminDashboard'));
const EditUserPage = React.lazy(() => import('../components/dashboard/EditUserPage'));
const EditEvent = React.lazy(() => import('../components/EditEvent'));
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
        element={
          <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <AdminLogin />
          </React.Suspense>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <AdminProtectedRoute>
            <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
              <AdminDashboard />
            </React.Suspense>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/edit-user/:type/:id"
        element={
          <AdminProtectedRoute>
            <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
              <EditUserPage />
            </React.Suspense>
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
            <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
              <EditEvent />
            </React.Suspense>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes; 