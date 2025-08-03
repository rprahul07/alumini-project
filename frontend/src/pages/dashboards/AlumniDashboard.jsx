import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  UserIcon,
  XMarkIcon,
  CheckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import useAlert from '../../hooks/useAlert';
import axios from '../../config/axios';
import MentorshipRequestModal from '../../components/MentorshipRequestModal';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MentorshipRequests from '../../components/mentorship/MentorshipRequests';
import MyActivityCard from '../../components/MyActivityCard';
import Opportunities from '../../components/opportunities/Opportunities';
import Events from '../../components/events/Events';

const TIERS = [
  {
    value: 1,
    name: 'Basic',
    description: 'Share your professional email address with the mentee.'
  },
  {
    value: 2,
    name: 'Advanced',
    description: 'Share your professional email and LinkedIn profile.'
  },
  {
    value: 3,
    name: 'Premium',
    description: 'Share your professional email, LinkedIn, and WhatsApp contact.'
  }
];

const roleColors = {
  student: 'bg-blue-100 text-blue-700',
  alumni: 'bg-green-100 text-green-700',
  faculty: 'bg-purple-100 text-purple-700',
  admin: 'bg-gray-200 text-gray-700',
};
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-500',
};
const tierLabels = ['', 'Basic', 'Advanced', 'Premium'];

// --- EventCard Component ---
const EventCard = ({ date, title, time, location, tags }) => {
  const [month, day] = date.split(' ');

  return (
    <article className="flex items-start space-x-5 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div
        className="flex-shrink-0 w-20 h-20 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100"
        aria-label={`Event date: ${month} ${day}`}
      >
        <div className="text-sm font-semibold text-indigo-700 uppercase leading-none">{month}</div>
        <div className="text-3xl font-bold text-indigo-900 leading-none mt-1">{day}</div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <div className="space-y-1 text-gray-600">
          <div className="flex items-center text-sm" aria-label={`Time: ${time}`}>
            <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
            <time>{time}</time>
          </div>
          <div className="flex items-center text-sm" aria-label={`Location: ${location}`}>
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

// --- MentorshipRequestCard Component ---
const MentorshipRequestCard = ({ studentName, department, semester, message, onAccept, onReject }) => (
  <article className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png"
        alt={`Photo of student ${studentName}`}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{studentName}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{department} • Semester {semester}</p>
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onAccept}
          className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-200 shadow-sm"
          aria-label={`Accept mentorship request from ${studentName}`}
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
          aria-label={`Reject mentorship request from ${studentName}`}
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Reject
        </button>
      </div>
    </div>
  </article>
);

// --- TabbedBoard Component ---
// const TabbedBoard = ({ jobs, showAlert }) => {
//   ...
// };

// --- AlumniDashboard Main Component ---
const AlumniDashboard = () => {
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useAlert();

  // Modern stats (dynamic values if available)
  const stats = [
    {
      title: 'Mentorships Given',
      value: 42,
      Icon: AcademicCapIcon,
      iconBg: 'bg-gradient-to-br from-indigo-200 to-purple-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Events Hosted',
      value: 21,
      Icon: CalendarIcon,
      iconBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Opportunities Posted',
      value: 17,
      Icon: BriefcaseIcon,
      iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
    },
  ];
  const mentorshipsCompleted = 42;
  const mentorshipsGoal = 50;
  const mentorshipProgress = Math.min(100, Math.round((mentorshipsCompleted / mentorshipsGoal) * 100));

  return (
    <>
      <Navbar />
      {/* Top nav bar (already present) */}
      <div className="min-h-screen font-roboto bg-gradient-to-br from-purple-50 to-white h-full pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] h-full items-stretch">
            {/* Sidebar: Profile + Thin Stats */}
            <div className="flex flex-col h-full w-full lg:w-1/3 max-w-xs mx-auto lg:mx-0 items-stretch min-w-0">
              <ProfileCard />
              {/* Stats Section - Modern Glassmorphism Card */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-4 w-full max-w-xs border border-gray-100">
                <div className="flex flex-col gap-2 w-full">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.title}
                      className={`flex flex-row items-center gap-4 py-3 px-2 rounded-xl group transition relative z-10`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${stat.iconBg} shadow group-hover:scale-110 transition`}>
                        <stat.Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex flex-col justify-center text-left">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight mb-0.5">{stat.value}</div>
                        <div className="text-sm font-semibold text-gray-700 tracking-wide capitalize">{stat.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Content: Hero + Activity */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 h-full">
              {/* Minimal Welcome Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 w-full border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.fullName || 'Alumni'}</span>
                  </h1>
                  <div className="w-full max-w-xs mt-2">
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex-shrink-0">
                  <div className="bg-indigo-50 rounded-full p-3 flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </div>
              {/* Activity Section */}
              <div className="bg-white rounded-2xl shadow-lg flex-1 min-h-0 p-4 flex flex-col overflow-y-auto scrollbar-hide min-w-0 w-full h-[600px] min-h-[500px] max-h-[700px]">
                  <MyActivityCard
                    features={[
                    { key: 'opportunities', label: 'Opportunities', component: <Opportunities /> },
                      { key: 'events', label: 'Events', component: <Events /> },
                    { key: 'mentorships', label: 'Mentorships', component: <MentorshipRequests /> },
                    ]}
                  defaultTab="opportunities"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AlumniDashboard; 