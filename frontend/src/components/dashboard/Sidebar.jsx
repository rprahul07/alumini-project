import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  UserGroupIcon,
  BriefcaseIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { title: 'Find Alumni', icon: UserGroupIcon, path: '/dashboard/find-alumni' },
  { title: 'Job Board', icon: BriefcaseIcon, path: '/dashboard/job-board' },
  { title: 'Mentorship', icon: UserIcon, path: '/dashboard/mentorship' },
  { title: 'Events', icon: CalendarIcon, path: '/dashboard/events' },
  { title: 'Forums', icon: ChatBubbleLeftRightIcon, path: '/dashboard/forums' },
  { title: 'Announcements', icon: MegaphoneIcon, path: '/dashboard/announcements' }
];

const Sidebar = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-2rem)]">
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Quick Navigation
      </h2>
      <nav className="space-y-1">
        {menuItems.map(({ title, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5 mr-3" />
            {title}
          </NavLink>
        ))}
      </nav>
    </div>
  </div>
);

export default Sidebar;
