import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Profile', href: '/profile', icon: UserIcon },
      { name: 'Events', href: '/events', icon: CalendarIcon },
      { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];

    switch (user.role) {
      case 'student':
        return [
          ...commonItems,
          { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
          { name: 'Mentorship', href: '/mentorship', icon: ChatBubbleLeftRightIcon },
        ];
      case 'faculty':
        return [
          ...commonItems,
          { name: 'Students', href: '/students', icon: UserIcon },
          { name: 'Research', href: '/research', icon: BriefcaseIcon },
        ];
      case 'alumni':
        return [
          ...commonItems,
          { name: 'Network', href: '/network', icon: UserIcon },
          { name: 'Mentorship', href: '/mentorship', icon: ChatBubbleLeftRightIcon },
        ];
      default:
        return commonItems;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <nav className="space-y-1">
        {getNavigationItems().map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              />
              {item.name}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
