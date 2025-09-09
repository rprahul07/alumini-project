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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Already logged in message */}
        {user && (
          <div className="mb-6 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-6 animate-slide-up">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-lg text-white mb-2 font-display">
                Welcome back!
              </p>
              <p className="text-white/80 mb-4">
                You are logged in as <span className="font-semibold text-primary-400">{user.fullName || user.email || user.role}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-body"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 font-body"
              >
                Logout & Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-display">
              Choose Your Role
            </h1>
            <p className="text-white/80 font-body">
              Select your role to get started with the platform
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-left group hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 font-display">
                        {role.title}
                      </h3>
                      <p className="text-sm text-white/70 font-body">
                        {role.description}
                      </p>
                    </div>
                    <div className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm font-body">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 