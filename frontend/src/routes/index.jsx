import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthPage from '../layouts/AuthPage';
import MainLayout from '../layouts/MainLayout';
import StudentDashboard from '../layouts/dashboards/StudentDashboard';
import FacultyDashboard from '../layouts/dashboards/FacultyDashboard';
import AlumniDashboard from '../layouts/dashboards/AlumniDashboard';
import AdminDashboard from '../layouts/dashboards/AdminDashboard';
import ProfileCard from '../components/dashboard/ProfileCard';
import ProfileEditor from '../components/dashboard/ProfileEditor';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userData = localStorage.getItem('user');

  if (!userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(userData);
    if (!user || !user.role) {
      throw new Error('Invalid user data');
    }
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

const DashboardRoute = () => {
  const location = useLocation();
  const userData = localStorage.getItem('user');

  try {
    const user = JSON.parse(userData);
    const role = user.role.toLowerCase();

    switch (role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'alumni':
        return <AlumniDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error('Error in DashboardRoute:', error);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRoute />} />
        <Route path="profile" element={<ProfileCard />} />
        <Route path="profile/edit" element={<ProfileEditor />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
