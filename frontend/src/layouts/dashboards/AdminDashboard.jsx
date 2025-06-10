import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/dashboard/Sidebar';
import ProfileCard from '../../components/dashboard/ProfileCard';
import {
  UserGroupIcon,
  MegaphoneIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const menuItems = [
    { title: 'User Verification', icon: UserGroupIcon, path: '/admin/users' },
    { title: 'Announcements & Events', icon: MegaphoneIcon, path: '/admin/announcements' },
    { title: 'Engagement Reports', icon: ChartBarIcon, path: '/admin/reports' },
    { title: 'Content Moderation', icon: ShieldCheckIcon, path: '/admin/moderation' },
    { title: 'Settings', icon: Cog6ToothIcon, path: '/admin/settings' },
    { title: 'Help', icon: QuestionMarkCircleIcon, path: '/admin/help' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-2">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <ProfileCard isProfileComplete={user?.name && user?.email && user?.phone} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Metric Cards */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Logins</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">1,245</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">876</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MegaphoneIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentorship Matches</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">432</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <ChartBarIcon className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* User Verification Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Verification</h2>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mb-6">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                  All (24)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Pending (12)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Approved (8)
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Rejected (4)
                </button>
              </div>

              {/* User table will go here */}
            </div>

            {/* Announcements Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Announcements & Events</h2>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create New</span>
                </button>
              </div>
              
              {/* Announcements content will go here */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
