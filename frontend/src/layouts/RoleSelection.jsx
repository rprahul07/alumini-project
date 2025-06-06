import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
  {
    id: 'faculty',
    title: 'Faculty',
    description: 'Teaching staff member',
    icon: UserGroupIcon,
    color: 'from-emerald-500 to-teal-600',
    hoverColor: 'from-emerald-600 to-teal-700',
  },
  // {
  //   id: 'admin',
  //   title: 'Admin',
  //   description: 'System Administrator',
  //   icon: <FiSettings className="w-8 h-8" />,
  // },
];

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('selectedRole', roleId);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Alumni Connect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community and connect with fellow students, alumni, and faculty members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative bg-white rounded-2xl p-8 text-left flex flex-col space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                     style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                     data-gradient={`${role.color}`} />
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {role.description}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <span className={`inline-flex items-center text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${role.color}`}>
                    Select Role
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a 
              href="mailto:support@alumniconnect.com" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              support@alumniconnect.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
