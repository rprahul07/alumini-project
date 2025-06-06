import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Role-specific dashboards
import StudentDashboard from '../layouts/dashboards/StudentDashboard';
import FacultyDashboard from '../layouts/dashboards/FacultyDashboard';
import AlumniDashboard from '../layouts/dashboards/AlumniDashboard';

const DashboardRedirect = () => {
  const { role } = useAuth();
  console.log('DashboardRedirect - Current role:', role);

  if (role === 'student') {
    console.log('Redirecting to student dashboard');
    return <Navigate to="/dashboard/student" replace />;
  }
  if (role === 'faculty') {
    console.log('Redirecting to faculty dashboard');
    return <Navigate to="/dashboard/faculty" replace />;
  }
  if (role === 'alumni') {
    console.log('Redirecting to alumni dashboard');
    return <Navigate to="/dashboard/alumni" replace />;
  }

  console.log('No role found, redirecting to role selection');
  return <Navigate to="/role-selection" replace />;
};

export default DashboardRedirect; 