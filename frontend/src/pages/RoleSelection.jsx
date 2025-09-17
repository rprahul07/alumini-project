import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Currently enrolled student at the college',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-indigo-600',
    hoverColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'Graduate of the college',
    icon: BriefcaseIcon,
    color: 'from-purple-500 to-pink-600',
    hoverColor: 'from-purple-600 to-pink-700',
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user, setSelectedRole, logout } = useAuth();

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    navigate('/auth'); // Unified AuthPage route
  };

  const handleContinue = () => {
    if (!user || !user.role) return;
    const role = user.role.toLowerCase();
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'alumni') navigate('/alumni/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/role-selection', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-white py-8 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Already logged in message */}
        {user && (
          <div className="mb-4 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-5 animate-slide-up">
            <div className="text-center mb-3">
              <div className="w-14 h-14 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-200">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-slate-900 mb-1 font-sans">
                Welcome back!
              </p>
              <p className="text-xs text-slate-600 mb-3 font-sans">
                You are logged in as <span className="font-semibold text-primary-600">{user.fullName || user.email || user.role}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-2.5 px-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-sans text-sm"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-slate-50 backdrop-blur-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 px-5 rounded-2xl transition-all duration-300 font-sans text-sm"
              >
                Logout & Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-2 font-sans">
              Choose Your Role
            </h1>
            <p className="text-sm text-slate-600 font-sans">
Select your role to get started with the platform
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full bg-slate-50 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300 text-left group hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1 font-sans">
                        {role.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-sans">
                        {role.description}
                      </p>
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs font-sans">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 