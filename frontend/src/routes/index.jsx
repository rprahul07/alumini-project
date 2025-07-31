import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import RoleSelection from '../pages/RoleSelection';
import StudentDashboard from '../pages/dashboards/StudentDashboard';
import FacultyDashboard from '../pages/dashboards/FacultyDashboard';
import AlumniDashboard from '../pages/dashboards/AlumniDashboard';
import ProfileCard from '../components/ProfileCard';
import ProfileEditor from '../components/ProfileEditor';
import EventsPage from '../pages/EventsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';
import AboutPage from '../pages/AboutPage';
import AlumniPage from '../pages/AlumniPage';
import ContactPage from '../pages/ContactPage';
import StudentsPage from '../pages/StudentsPage';
import JobsPage from '../pages/JobsPage';
import FaqPage from '../pages/FaqPage';


// Protected route for a specific role
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a spinner
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/alumni" element={<ProtectedRoute><AlumniPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'alumni', 'admin']}>
            <StudentsPage />
          </ProtectedRoute>
        }
        
      />

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      {/* Faculty Dashboard */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      {/* Alumni Dashboard */}
      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRoles={['alumni']}>
            <AlumniDashboard />
          </ProtectedRoute>
        }
      />
      {/* Profile routes (all logged-in users) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEditor />
          </ProtectedRoute>
        }
      />
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
