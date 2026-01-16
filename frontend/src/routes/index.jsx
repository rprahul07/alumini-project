import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const RoleSelection = lazy(() => import('../pages/RoleSelection'));
const ProfileCard = lazy(() => import('../components/ProfileCard'));
const ProfileEditor = lazy(() => import('../components/ProfileEditor'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const AlumniPage = lazy(() => import('../pages/AlumniPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const StudentsPage = lazy(() => import('../pages/StudentsPage'));
const JobsPage = lazy(() => import('../pages/JobsPage'));
const FaqPage = lazy(() => import('../pages/FaqPage'));
const TestimonialsPage = lazy(() => import('../pages/TestimonialsPage'));

// Lazy load dashboard components for better performance
const StudentDashboard = lazy(() => import('../pages/dashboards/StudentDashboard'));
const FacultyDashboard = lazy(() => import('../pages/dashboards/FacultyDashboard'));
const AlumniDashboard = lazy(() => import('../pages/dashboards/AlumniDashboard'));

// Loading component for Suspense
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);


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
    <Suspense fallback={<DashboardLoading />}>
      <Routes>
        {/* Auth routes without navbar */}
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* HomePage with special styling */}
        <Route path="/" element={<HomePage />} />

        {/* Routes with individual Navbar components */}
        <Route path="events" element={<EventsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route
          path="alumni"
          element={
            <ProtectedRoute>
              <AlumniPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'alumni', 'admin']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="jobs"
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
              <Suspense fallback={<DashboardLoading />}>
                <StudentDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        {/* Faculty Dashboard */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Suspense fallback={<DashboardLoading />}>
                <FacultyDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        {/* Alumni Dashboard */}
        <Route
          path="/alumni/dashboard"
          element={
            <ProtectedRoute allowedRoles={['alumni']}>
              <Suspense fallback={<DashboardLoading />}>
                <AlumniDashboard />
              </Suspense>
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
    </Suspense>
  );
};

export default AppRoutes;
