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
  
  // ✅ State for dynamic stats
  const [stats, setStats] = useState([
    {
      title: 'Mentorships Given',
      value: 0,
      Icon: AcademicCapIcon,
      iconBg: 'bg-gradient-to-br from-indigo-200 to-purple-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Events Created',
      value: 0,
      Icon: CalendarIcon,
      iconBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Jobs Posted',
      value: 0,
      Icon: BriefcaseIcon,
      iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Student Connections',
      value: 0,
      Icon: UserGroupIcon,
      iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100',
      iconColor: 'text-orange-600',
    },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ Fetch profile data with stats when component mounts
  useEffect(() => {
    const fetchProfileWithStats = async () => {
      setStatsLoading(true);
      try {
        // Use existing profile API that now includes stats
        const response = await axios.get('/api/alumni/profile/get');
        if (response.data.success && response.data.data.dashboardStats) {
          const { dashboardStats } = response.data.data;
          
          // Update stats with real data
          setStats(prevStats => [
            { ...prevStats[0], value: dashboardStats.mentorshipRequests },
            { ...prevStats[1], value: dashboardStats.eventsCreated },
            { ...prevStats[2], value: dashboardStats.jobsPosted },
            { ...prevStats[3], value: dashboardStats.bookmarksReceived },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch profile with stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchProfileWithStats();
  }, []);

  const mentorshipsCompleted = stats[0]?.value || 0;
  const mentorshipsGoal = 50;
  const mentorshipProgress = Math.min(100, Math.round((mentorshipsCompleted / mentorshipsGoal) * 100));

  return (
    <>
      <Navbar />
      {/* Top nav bar (already present) */}
      <div className="min-h-screen font-roboto bg-gradient-to-br from-purple-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] items-start">
            {/* Sidebar: Profile + Stats */}
            <div className="flex flex-col w-full lg:w-80 min-w-0">
              <ProfileCard />
              {/* Stats Section - Compact Design */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mt-4 border border-gray-200/50">
                <h3 className="text-xs font-bold text-gray-700 mb-3 tracking-wider uppercase">Quick Stats</h3>
                {statsLoading ? (
                  // Loading skeleton
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                        <div className="w-5 h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-8"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {stats.map((stat, i) => (
                      <div
                        key={stat.title}
                        className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-100/70 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
                      >
                        <div className={`w-5 h-5 flex items-center justify-center rounded ${stat.iconBg} mb-2 group-hover:scale-105 transition-transform duration-150`}>
                          <stat.Icon className={`w-3 h-3 ${stat.iconColor}`} />
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-0.5 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-600 leading-tight">{stat.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Content: Welcome + Activity */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Welcome Card - Standardized */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.fullName || 'Alumni'}</span>
                  </h1>
                  <div className="w-full max-w-sm">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-shrink-0">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full p-4 flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </div>
              
              {/* Activity Section - Standardized */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 flex-1 p-5 flex flex-col overflow-hidden">
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