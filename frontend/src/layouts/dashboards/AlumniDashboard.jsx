import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileCard from '../../components/dashboard/ProfileCard';
import Sidebar from '../../components/dashboard/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, Icon, color, progress, progressText }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getColorClasses(color)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progressText}</p>
      </div>
    </div>
  );
};

const EventCard = ({ date, title, time, location, tags }) => {
  const [month, day] = date.split(' ');

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 w-16 bg-gray-100 rounded-lg p-2 text-center">
        <div className="text-xs font-medium text-gray-500 uppercase">{month}</div>
        <div className="text-2xl font-bold text-gray-900">{day}</div>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="mt-1 space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1.5" />
            {time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1.5" />
            {location}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MentorshipRequestCard = ({ studentName, department, semester, message, onAccept, onReject }) => (
  <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png"
        alt={studentName}
        className="w-12 h-12 rounded-full object-cover"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{studentName}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{department} • Semester {semester}</p>
      <p className="text-sm text-gray-600 mt-2">{message}</p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onAccept}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
        >
          <CheckCircleIcon className="h-4 w-4 mr-1.5" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
        >
          <XCircleIcon className="h-4 w-4 mr-1.5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

const JobBoard = () => {
  const jobs = [
    {
      position: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "New York, NY",
      type: "Full-time",
      posted: "2 days ago",
      department: "Engineering"
    },
    {
      position: "UX Designer",
      company: "Design Studio",
      location: "Remote",
      type: "Contract",
      posted: "1 week ago",
      department: "Design"
    },
    {
      position: "Product Manager",
      company: "Innovation Labs",
      location: "San Francisco, CA",
      type: "Full-time",
      posted: "3 days ago",
      department: "Product"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BriefcaseIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Job Board</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-6 gap-4 bg-gray-50 px-4 py-2 rounded-t-lg">
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Position</div>
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Company</div>
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Location</div>
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Type</div>
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Posted</div>
            <div className="uppercase text-xs text-gray-500 font-medium tracking-wide">Action</div>
          </div>

          <div className="divide-y divide-gray-100">
            {jobs.map((job, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 px-4 py-3 hover:bg-gray-50">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{job.position}</div>
                  <div className="text-xs text-gray-500">{job.department}</div>
                </div>
                <div className="text-sm text-gray-700">{job.company}</div>
                <div className="text-sm text-gray-700">{job.location}</div>
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    job.type === 'Full-time' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {job.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">{job.posted}</div>
                <div>
                  <button className="text-sm font-medium text-indigo-600 hover:underline">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block text-sm text-indigo-700 bg-gray-100 px-3 py-1 rounded-full">
          ** Coming Soon ** More job postings will be added
        </span>
      </div>
    </div>
  );
};

const AlumniDashboard = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      date: 'MAY 15',
      title: 'Tech Talk: Future of AI',
      time: '2:00 PM - 4:00 PM',
      location: 'Main Auditorium',
      tags: ['In-Person', 'Panel']
    },
    {
      date: 'MAY 20',
      title: 'Career Fair 2024',
      time: '10:00 AM - 5:00 PM',
      location: 'Virtual',
      tags: ['Virtual', 'Career']
    }
  ];

  const mentorshipRequests = [
    {
      studentName: 'John Smith',
      department: 'Computer Science',
      semester: '6',
      message: 'I am interested in learning about software development and would appreciate your guidance.'
    },
    {
      studentName: 'Emma Wilson',
      department: 'Information Technology',
      semester: '4',
      message: 'Looking for mentorship in web development and career guidance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.fullName || 'John'}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening in your alumni network today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile and Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard />
            <Sidebar />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Network Size"
                value="12,458"
                Icon={UserGroupIcon}
                color="blue"
                progress={75}
                progressText="75% of alumni connected"
              />
              <StatCard
                title="Job Opportunities"
                value="156"
                Icon={BriefcaseIcon}
                color="green"
                progress={60}
                progressText="60% match rate"
              />
              <StatCard
                title="Upcoming Events"
                value="8"
                Icon={CalendarIcon}
                color="purple"
                progress={40}
                progressText="40% RSVP rate"
              />
            </div>

            {/* Events and Mentorship Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Events Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6">** Coming Soon ** More events will be added</p>
              </div>

              {/* Mentorship Requests Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mentorship Requests</h2>
                <div className="divide-y divide-gray-100">
                  {mentorshipRequests.map((request, index) => (
                    <MentorshipRequestCard
                      key={index}
                      {...request}
                      onAccept={() => console.log('Accept request:', request.studentName)}
                      onReject={() => console.log('Reject request:', request.studentName)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6">** Coming Soon ** More requests will be added</p>
              </div>
            </div>

            {/* Job Board Section */}
            <JobBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
