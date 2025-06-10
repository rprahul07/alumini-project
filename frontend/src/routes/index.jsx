import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

import AuthPage from '../layouts/AuthPage';
import AdminLogin from '../layouts/AdminLogin';
import ActivityLogs from '../layouts/ActivityLogs';
import RoleSelection from '../layouts/RoleSelection';
import ProfileEditor from '../components/dashboard/ProfileEditor';
import MainLayout from '../layouts/MainLayout';

// Dashboard redirection and utility components
import DashboardRedirect from '../components/DashboardRedirect';
import UnauthorizedPage from '../components/UnauthorizedPage';
import NotFoundPage from '../components/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AuthCheck from '../components/AuthCheck';

// Role-specific dashboards
import StudentDashboard from '../layouts/dashboards/StudentDashboard';
import FacultyDashboard from '../layouts/dashboards/FacultyDashboard';
import AlumniDashboard from '../layouts/dashboards/AlumniDashboard';

// Root component that provides Auth context
const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Navigate to="/role-selection" replace />,
      },
      {
        path: '/role-selection',
        element: (
          <AuthCheck>
            <RoleSelection />
          </AuthCheck>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthCheck>
            <AuthPage authType="login" />
          </AuthCheck>
        ),
      },
      {
        path: '/register',
        element: (
          <AuthCheck>
            <AuthPage authType="register" />
          </AuthCheck>
        ),
      },
      {
        path: '/admin',
        element: (
          <AuthCheck>
            <AdminLogin />
          </AuthCheck>
        ),
      },
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute allowedRoles={['student', 'alumni', 'faculty']}>
                <DashboardRedirect />
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile/edit',
            element: (
              <ProtectedRoute allowedRoles={['student', 'alumni', 'faculty']}>
                <ProfileEditor />
              </ProtectedRoute>
            ),
          },
          {
            path: 'dashboard/student',
            element: (
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'dashboard/faculty',
            element: (
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'dashboard/alumni',
            element: (
              <ProtectedRoute allowedRoles={['alumni']}>
                <AlumniDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/logs',
            element: (
              <ProtectedRoute allowedRoles={['admin']}>
                <ActivityLogs />
              </ProtectedRoute>
            ),
          },
          {
            path: 'unauthorized',
            element: <UnauthorizedPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
