import React, { useState, useEffect } from 'react';
import ProfileCard from '../../components/dashboard/ProfileCard';
import Sidebar from '../../components/dashboard/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

// --- StatCard Component ---
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

  const getProgressBarColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-7 w-7" />
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-5">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressBarColor(color)}`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{progressText}</p>
        </div>
      )}
    </div>
  );
};

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

// --- JobBoard Component ---
const JobBoard = () => {
  const jobs = [
    {
      position: "Software Engineer (Full-stack)",
      company: "Innovate Solutions",
      location: "Bengaluru, India",
      type: "Full-time",
      posted: "2 days ago",
      department: "Software Engineering"
    },
    {
      position: "Senior UX Designer",
      company: "Creative Minds Co.",
      location: "Remote",
      type: "Contract",
      posted: "1 week ago",
      department: "Product Design"
    },
    {
      position: "Data Scientist",
      company: "Analytics Hub",
      location: "Mumbai, India",
      type: "Full-time",
      posted: "3 days ago",
      department: "Data Science"
    },
    {
      position: "Marketing Specialist",
      company: "Growth Marketing Ltd.",
      location: "Kochi, India",
      type: "Full-time",
      posted: "4 days ago",
      department: "Marketing"
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-gray-900">Recent Job Opportunities</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group" aria-label="View all job opportunities">
          View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Job opportunities table">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position & Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{job.position}</div>
                  <div className="text-xs text-gray-500 mt-1">{job.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.type === 'Full-time'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {job.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.posted}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors" aria-label={`Apply for ${job.position} at ${job.company}`}>
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block text-sm text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
          ** Coming Soon ** More job postings will be added
        </span>
      </div>
    </section>
  );
};

// --- AlumniDashboard Main Component ---
const AlumniDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const upcomingEvents = [
    {
      date: 'JUL 22',
      title: 'Annual Alumni Global Meet',
      time: '10:00 AM - 6:00 PM',
      location: 'Virtual & Main Campus, Block C',
      tags: ['Hybrid', 'Networking', 'Reunion'],
    },
    {
      date: 'AUG 05',
      title: 'Tech Alumni Speaker Series: AI in 2025',
      time: '3:00 PM - 4:30 PM',
      location: 'Online Webinar',
      tags: ['Virtual', 'Tech', 'Learning'],
    },
    {
      date: 'SEP 10',
      title: 'Career Mentorship Workshop',
      time: '11:00 AM - 1:00 PM',
      location: 'Alumni Hall, Room 301',
      tags: ['In-Person', 'Career', 'Mentorship'],
    },
  ];

  const mentorshipRequests = [
    {
      studentName: 'John Smith',
      department: 'Computer Science',
      semester: '6',
      message:
        'I am a 3rd-year CS student keen on software development. Your experience at Innovate Solutions aligns perfectly with my interests. Could you spare some time for guidance?',
    },
    {
      studentName: 'Emma Wilson',
      department: 'Information Technology',
      semester: '4',
      message:
        'As a 2nd-year IT student, I am exploring web development. I would greatly appreciate your insights into the industry and career paths.',
    },
    {
      studentName: 'David Lee',
      department: 'Electronics Engineering',
      semester: '7',
      message:
        'I am passionate about hardware design and embedded systems. Your work at Tech Innovations is inspiring. I seek your advice on project selection and industry trends.',
    },
  ];

  const handleAcceptMentorship = (studentName) => {
    console.log(`Accepted mentorship request from ${studentName}`);
  };

  const handleRejectMentorship = (studentName) => {
    console.log(`Rejected mentorship request from ${studentName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <header className="mb-8" aria-label="Welcome message">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Welcome back, <span className="text-indigo-600">{user?.fullName || 'Alumni'}</span>!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Your personalized dashboard to connect, contribute, and stay updated.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Left Column - Profile and Navigation */}
          <aside className="lg:col-span-1 space-y-8" aria-label="Sidebar and profile section">
            <ProfileCard />
            <Sidebar />
          </aside>

          {/* Right Column - Main Content */}
          <main className="lg:col-span-3 space-y-10" aria-label="Main dashboard content">
            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Quick stats summary">
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
                value={upcomingEvents.length}
                Icon={CalendarIcon}
                color="purple"
                progress={40}
                progressText="40% RSVP rate"
              />
            </section>

            {/* Events and Mentorship Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8" aria-label="Events and mentorship requests">
              {/* Upcoming Events Section */}
              <section className="bg-white rounded-xl shadow-md p-6" aria-label="Upcoming events">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                  <button
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group"
                    aria-label="View all upcoming events"
                  >
                    View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100 -mx-4 -mt-4" tabIndex="0">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                  ** Coming Soon ** More events will be added
                </p>
              </section>

              {/* Mentorship Requests Section */}
              <section className="bg-white rounded-xl shadow-md p-6" aria-label="Mentorship requests">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Mentorship Requests ({mentorshipRequests.length})
                  </h2>
                  <button
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group"
                    aria-label="View all mentorship requests"
                  >
                    View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100 -mx-4 -mt-4" tabIndex="0">
                  {mentorshipRequests.map((request, index) => (
                    <MentorshipRequestCard
                      key={index}
                      {...request}
                      onAccept={() => handleAcceptMentorship(request.studentName)}
                      onReject={() => handleRejectMentorship(request.studentName)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                  ** Coming Soon ** More requests will be added
                </p>
              </section>
            </section>

            {/* Job Board Section */}
            <JobBoard />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
