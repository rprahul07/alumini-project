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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Already logged in message */}
        {user && (
          <div className="mb-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
            <p className="text-lg text-gray-800 mb-4 text-center">
              You are already logged in as <span className="font-semibold text-indigo-700">{user.fullName || user.email || user.role}</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Continue to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-full transition-all duration-200"
              >
                Logout & Switch Account
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Choose your role to get started
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
                  className="w-full bg-white/60 backdrop-blur border-2 border-indigo-200 rounded-2xl p-4 hover:border-indigo-400 hover:bg-white/80 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {role.description}
                      </p>
                    </div>
                    <div className="text-indigo-600 group-hover:translate-x-1 transition-transform duration-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 