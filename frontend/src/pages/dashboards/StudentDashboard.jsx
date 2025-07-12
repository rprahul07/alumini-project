import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  AcademicCapIcon, // For Mentorship
  SparklesIcon,    // For Clubs/Activities
  ArrowRightIcon, // Added for 'View All' buttons
  UserIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

import axios from '../../config/axios';
import ReactDOM from 'react-dom';
import StudentMentorshipRequests from '../../components/mentorship/StudentMentorshipRequests';
import AppliedJobs from '../../components/opportunities/AppliedJobs';

// --- StudentDashboard Main Component ---
const StudentDashboard = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      date: 'JUL 18',
      title: 'Workshop: Mastering React Hooks',
      time: '1:00 PM - 3:00 PM',
      location: 'Computer Lab 3, Block A',
      tags: ['Technical', 'Hands-on']
    },
    {
      date: 'AUG 02',
      title: 'Career Fair 2025: Internship Focus',
      time: '10:00 AM - 4:00 PM',
      location: 'University Gymnasium',
      tags: ['Internship', 'Networking']
    },
    {
      date: 'AUG 25',
      title: 'Guest Lecture: Blockchain Beyond Crypto',
      time: '11:00 AM - 12:30 PM',
      location: 'Online Webinar',
      tags: ['Virtual', 'Innovation']
    }
  ];

  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer at Google',
      tags: ['Software Development', 'Career Guidance', 'AI/ML']
    },
    {
      name: 'Prof. Michael Chen',
      title: 'Research Director at Microsoft',
      tags: ['AI/ML', 'Research', 'Academic Guidance']
    },
    {
      name: 'Priya Sharma',
      title: 'Product Manager at Flipkart (Alumni)',
      tags: ['Product Management', 'Startup Insights', 'E-commerce']
    }
  ];

  const clubsAndActivities = [
    {
      name: 'Code Club',
      members: '150+ members',
      iconColor: 'blue',
      description: 'Weekly coding challenges and hackathons.'
    },
    {
      name: 'Robotics Team',
      members: '40 members',
      iconColor: 'green',
      description: 'Building and competing with autonomous robots.'
    },
    {
      name: 'Entrepreneurship Cell',
      members: '80+ members',
      iconColor: 'purple',
      description: 'Ideation sessions and startup mentorship.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mt-5 bg-gradient-to-r from-blue-100 via-white to-indigo-50 rounded-xl p-5 flex items-center min-h-[96px]">
                <div>
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                  Welcome back, <span className="text-blue-500 font-bold">{user?.fullName || 'Student'}</span>!
                </h1>
                <p className="text-lx text-gray-500">
                  Your personalized dashboard to explore opportunities and connect with the community.
                </p>
              </div>
                  </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-start">
            {/* Left Column - Profile and Navigation */}
            <aside className="lg:col-span-1 flex flex-col gap-2 items-stretch justify-start min-h-0" aria-label="Sidebar and profile section">
              <div className="flex-shrink-0">
                <ProfileCard compact />
              </div>
              <div className="flex-shrink-0">
                <Sidebar compact />
              </div>
            </aside>
            {/* Welcome Card - aligned horizontally with ProfileCard */}
            <div className="lg:col-span-3">
             
              {/* Statistics Cards Section - Redesigned to match project UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 mt-2">
                {/* Alumni Count */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105 ">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <UserGroupIcon className="text-indigo-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">1,200</div>
                    <div className="text-gray-500 text-sm">Alumni Count</div>
                  </div>
                </div>
                {/* Jobs/Opportunities */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-green-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BriefcaseIcon className="text-green-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">87</div>
                    <div className="text-gray-500 text-sm">Jobs/Opportunities</div>
                  </div>
                </div>
                {/* Events */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-purple-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CalendarIcon className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">34</div>
                    <div className="text-gray-500 text-sm">Events Conducted</div>
                  </div>
                </div>
              </div>
              <main className="space-y-5">
                {/* Activity Tabbed Card Section */}
                <MyActivityCard />
              </main>
                  </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- MyActivityCard Component for Student ---
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-500',
};
const tierLabels = ['', 'Basic', 'Advanced', 'Premium'];

const MyActivityCard = () => {
  const [mainTab, setMainTab] = useState('mentorship');
  const features = [
    {
      key: 'mentorship',
      label: 'Mentorship',
      component: <StudentMentorshipRequests />,
    },
    {
      key: 'opportunities',
      label: 'Opportunities',
      component: <AppliedJobs />,
    },
  ];
  return (
    <section className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col min-h-[320px] md:min-h-[420px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Activity</h2>
      </div>
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
          {features.map(feature => (
                    <button
              key={feature.key}
              className={`px-3 py-1 sm:px-3 sm:py-1 rounded-full text-sm font-semibold border transition-colors ${mainTab === feature.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => setMainTab(feature.key)}
                    >
              {feature.label}
                    </button>
          ))}
                    </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {features.find(f => f.key === mainTab)?.component}
        </div>
    </section>
  );
};

export default StudentDashboard; 