import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBook, FiBriefcase, FiSettings } from 'react-icons/fi';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Currently enrolled student',
    icon: <FiBook className="w-8 h-8" />,
  },
  {
    id: 'alumni',
    title: 'Alumni',
    description: 'Graduated student',
    icon: <FiBriefcase className="w-8 h-8" />,
  },
  {
    id: 'faculty',
    title: 'Faculty',
    description: 'Teaching staff',
    icon: <FiUser className="w-8 h-8" />,
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
    navigate(roleId === 'admin' ? '/admin' : '/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-[1000px] mx-auto w-full px-4">
        <div className="text-center mb-16">
          <h1 className="text-[2.75rem] font-bold text-gray-900 mb-3">
            Welcome to Alumni Connect
          </h1>
          <h2 className="text-xl text-gray-600">
            Select your role to get started
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="bg-white rounded-2xl p-8 text-center flex flex-col items-center space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow duration-200"
            >
              <div className="text-gray-600">
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {role.title}
              </h3>
              <p className="text-sm text-gray-600">
                {role.description}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a 
              href="mailto:support@alumniconnect.com" 
              className="text-blue-600 hover:text-blue-800"
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
