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

  // Static data
  const stats = [
    { title: "Connections", value: 450, Icon: UserGroupIcon, color: "blue", progress: 75, progressText: "25 to next milestone" },
    { title: "Events Attended", value: 25, Icon: CalendarIcon, color: "green", progress: 60, progressText: "5 events this year" },
    { title: "Mentorships", value: 12, Icon: BriefcaseIcon, color: "purple", progress: 90, progressText: "3 new mentees" },
  ];
  const jobs = [
    {
      position: "Software Engineer (Full-stack)",
      company: "Innovate Solutions",
      location: "Bengaluru, India",
      type: "Full-time",
      appliedOn: "2024-07-01",
      department: "Software Engineering",
      status: "Under Review"
    },
    {
      position: "Senior UX Designer",
      company: "Creative Minds Co.",
      location: "Remote",
      type: "Contract",
      appliedOn: "2024-06-25",
      department: "Product Design",
      status: "Interview Scheduled"
    },
    {
      position: "Data Scientist",
      company: "Analytics Hub",
      location: "Mumbai, India",
      type: "Full-time",
      appliedOn: "2024-06-20",
      department: "Data Science",
      status: "Rejected"
    },
    {
      position: "Marketing Specialist",
      company: "Growth Marketing Ltd.",
      location: "Kochi, India",
      type: "Full-time",
      appliedOn: "2024-06-15",
      department: "Marketing",
      status: "Accepted"
    }
  ];
  const mentorshipRequests = [
    { studentName: "Anjali Menon", department: "Computer Science", semester: 6, message: "Looking for guidance on full-stack development and career opportunities...", role: 'alumni' },
    { studentName: "Rohan Kumar", department: "Mechanical", semester: 4, message: "Interested in learning about the automotive industry and higher studies options.", role: 'student' },
  ];
  
  const handleAcceptMentorship = (studentName) => {
    // Handle accept logic
    console.log(`Accepted mentorship for ${studentName}`);
  };

  const handleRejectMentorship = (studentName) => {
    // Handle reject logic
    console.log(`Rejected mentorship for ${studentName}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="mt-3 bg-gradient-to-r from-green-100 via-white to-indigo-50 rounded-xl p-5 flex items-center min-h-[96px]">
                <div>
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                    Welcome back, <span className="text-green-500 font-bold">{user?.fullName || 'Alumni'}</span>!
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
             
              <main className="space-y-5">
                {/* Statistics Cards Section - Redesigned to match project UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {/* Students */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <UserGroupIcon className="text-indigo-600 text-2xl" />
                  </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">900</div>
                      <div className="text-gray-500 text-sm">Students</div>
                  </div>
                  </div>
                  {/* Mentorships Given */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-purple-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <AcademicCapIcon className="text-purple-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">42</div>
                      <div className="text-gray-500 text-sm">Mentorships Given</div>
                    </div>
                  </div>
                  {/* Jobs/Internships Posted */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-green-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <BriefcaseIcon className="text-green-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">58</div>
                      <div className="text-gray-500 text-sm">Opportunities</div>
                    </div>
                  </div>
                  {/* Events Hosted */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-yellow-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <CalendarIcon className="text-yellow-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">21</div>
                      <div className="text-gray-500 text-sm">Events Hosted</div>
                    </div>
                  </div>
              </div>

                {/* Tabbed Board Section */}
                <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
                  <MyActivityCard
                    features={[
                      { key: 'mentorship', label: 'Mentorship', component: <MentorshipRequests showAlert={showAlert} jobs={jobs} /> },
                      { key: 'opportunities', label: 'Opportunities', component: <Opportunities /> },
                      { key: 'events', label: 'Events', component: <Events /> },
                    ]}
                    defaultTab="mentorship"
                  />
                </div>
            </main>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AlumniDashboard; 