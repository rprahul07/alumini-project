import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserGroupIcon,
  BriefcaseIcon, // Can be repurposed for placements/industry links
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon, // For courses/research
  ClipboardDocumentListIcon, // For pending tasks/approvals
  AcademicCapIcon, // For student-related stats
  ArrowRightIcon, // For "View All" buttons
} from '@heroicons/react/24/outline';
import MyActivityCard from '../../components/MyActivityCard';
import MentorshipRequests from '../../components/mentorship/MentorshipRequests';
import Opportunities from '../../components/opportunities/Opportunities';
import Events from '../../components/events/Events';


// --- AlumniRegistrationCard Component (Enhanced for clarity and interaction) ---
const AlumniRegistrationCard = ({ name, graduationYear, department, email, onApprove, onReject }) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png" // Replace with dynamic avatar if available
        alt={name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <div className="mt-1 space-y-1 text-sm text-gray-600">
        <p><span className="font-medium text-gray-700">Graduation:</span> {graduationYear}</p>
        <p><span className="font-medium text-gray-700">Department:</span> {department}</p>
        <p className="flex items-center"><span className="font-medium text-gray-700 mr-1">Email:</span> <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">{email}</a></p>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onApprove}
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-green-700 bg-green-100 hover:bg-green-200 transition-colors duration-200 shadow-sm flex items-center"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="rounded-full px-4 py-1.5 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200 shadow-sm flex items-center"
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

// --- FacultyDashboard Main Component ---
const FacultyDashboard = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      date: 'JUL 12', // Updated date
      title: 'Department Meeting: Curriculum Review',
      time: '11:00 AM - 1:00 PM',
      location: 'Faculty Meeting Room 2',
      tags: ['Internal', 'Meeting']
    },
    {
      date: 'JUL 25', // Updated date
      title: 'Guest Lecture: Advanced AI Ethics',
      time: '3:00 PM - 4:30 PM',
      location: 'Main Auditorium',
      tags: ['Public', 'Academic']
    },
    {
        date: 'AUG 05', // New event
        title: 'Thesis Defense Committee Session',
        time: '9:00 AM - 12:00 PM',
        location: 'Research Lab, Block C',
        tags: ['Internal', 'Research']
      }
  ];

  const pendingRegistrations = [
    {
      name: 'Priya Rajan',
      graduationYear: '2024',
      department: 'Electronics & Communication Engg.',
      email: 'priya.rajan@example.com'
    },
    {
      name: 'Ahmed Khan',
      graduationYear: '2023',
      department: 'Mechanical Engineering',
      email: 'ahmed.khan@example.com'
    }
  ];

  // Placeholder functions for approve/reject actions
  const handleApproveRegistration = (name) => {
    console.log(`Approved alumni registration for ${name}`);
    // In a real application, you'd send an API request here
  };

  const handleRejectRegistration = (name) => {
    console.log(`Rejected alumni registration for ${name}`);
    // In a real application, you'd send an API request here
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-5 bg-gradient-to-r from-purple-100 via-white to-indigo-50 rounded-xl p-5 flex items-center min-h-[96px]">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                    Welcome back, <span className="text-purple-500 font-bold">{user?.fullName || 'Faculty'}</span>!
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-2">
                {/* Alumni */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <UserGroupIcon className="text-indigo-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">1,200</div>
                    <div className="text-gray-500 text-sm">Alumni</div>
                  </div>
                </div>
                {/* Students */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-purple-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <AcademicCapIcon className="text-purple-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">900</div>
                    <div className="text-gray-500 text-sm">Students</div>
                  </div>
                </div>
                {/* Opportunities */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-green-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BriefcaseIcon className="text-green-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">145</div>
                    <div className="text-gray-500 text-sm">Opportunities</div>
                  </div>
                </div>
                {/* Events */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-yellow-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <CalendarIcon className="text-yellow-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">56</div>
                    <div className="text-gray-500 text-sm">Events</div>
                  </div>
                </div>
              </div>
              <main className="space-y-5">
                {/* Main Content Rows */}
                <MyActivityCard
                  features={[
                    { key: 'mentorship', label: 'Mentorship', component: <MentorshipRequests /> },
                    { key: 'opportunities', label: 'Opportunities', component: <Opportunities /> },
                    { key: 'events', label: 'Events', component: <Events /> },
                  ]}
                  defaultTab="mentorship"
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard; 