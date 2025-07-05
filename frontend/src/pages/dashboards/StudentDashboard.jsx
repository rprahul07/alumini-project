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
              <div className="mb-3 mt-5 bg-white rounded-xl p-5 flex items-center min-h-[96px]">
                <div>
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                  Welcome back, <span className="text-indigo-500 font-bold">{user?.fullName || 'Student'}</span>!
                </h1>
                <p className="text-lx text-gray-500">
                  Your personalized dashboard to explore opportunities and connect with the community.
                </p>
              </div>
                  </div>
              {/* Statistics Cards Section - Redesigned to match project UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {/* Alumni Count */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105">
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
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get('/api/support/check_tier/alumni')
      .then(res => {
        if (res.data.success) {
          setSentRequests(res.data.requests.map(r => ({ ...r, id: r.requestId })));
        } else setError(res.data.message || 'Failed to fetch sent requests');
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, []);

  const handleViewProfile = (req) => {
    setSelectedRequest(req);
    setShowProfileModal(true);
    setContactLoading(true);
    setContactError(false);
    
    // Simulate loading animation for contact info
    setTimeout(() => {
      setContactLoading(false);
    }, 1500);
  };

  const handleDeleteSentRequest = async (req) => {
    if (!window.confirm('Are you sure you want to permanently delete this request? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/support/delete/requester/${req.id}`);
      setSentRequests(prev => prev.filter(r => r.id !== req.id));
    } catch (err) {
      alert('Failed to delete request.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col min-h-[320px] md:min-h-[420px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex items-center space-x-2 mb-4">
        <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Activity</h2>
      </div>
      <div className="flex-1 overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Sent mentorship requests table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 w-40 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-2 py-2 w-32 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr key="loading"><td colSpan={4} className="text-center text-gray-500 py-6">Loading...</td></tr>
            ) : error ? (
              <tr key="error"><td colSpan={4} className="text-center text-red-500 py-6">{error}</td></tr>
            ) : sentRequests.length === 0 ? (
              <tr key="empty"><td colSpan={4} className="text-center text-gray-500 py-6">No mentorship requests sent yet.</td></tr>
            ) : (
              sentRequests.map((req, index) => (
                <tr key={`request-${req.id || req.requestId || req.alumni?.id || index}`} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-2 py-2 whitespace-nowrap font-semibold">
                    <div className="flex items-center gap-2">
                      <img 
                        src={req.alumni?.photoUrl} 
                        alt={req.alumni?.fullName || 'Alumni'} 
                        className="w-7 h-7 rounded-full object-cover border border-gray-200" 
                      />
                      <span className="truncate max-w-[120px] block">
                        {req.alumni?.fullName || 'Alumni'}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">alumni</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                    <span className={`inline-block px-2 py-1 rounded-full font-semibold ${statusColors[req.status]}`}>{req.status}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right relative flex gap-2 justify-end">
                    <button
                      className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                      onClick={e => { e.stopPropagation(); handleViewProfile(req); }}
                    >
                      View
                    </button>
                    <div className="relative inline-block">
                      <button
                        className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                        onClick={e => {
                          e.stopPropagation();
                          if (openDropdownId === req.id) {
                            setOpenDropdownId(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPosition({
                              top: rect.bottom + window.scrollY,
                              left: rect.right + window.scrollX - 128,
                              width: rect.width
                            });
                            setOpenDropdownId(req.id);
                          }
                        }}
                      >
                        ⋮
                      </button>
                      {openDropdownId === req.id && ReactDOM.createPortal(
                        <div style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left, width: 128, zIndex: 9999 }} className="bg-white border border-gray-200 rounded-lg shadow-lg">
                          <ul className="py-1 text-sm">
                            <li key="delete">
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700"
                                onClick={e => { e.stopPropagation(); setOpenDropdownId(null); handleDeleteSentRequest(req); }}
                              >
                                🗑️ Delete
                              </button>
                            </li>
                          </ul>
                        </div>,
                        document.body
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showProfileModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Mentorship Request Details</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Alumni Image */}
            <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
              {selectedRequest.alumni?.photoUrl ? (
                <img 
                  src={selectedRequest.alumni.photoUrl} 
                  alt={selectedRequest.alumni.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                  <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  selectedRequest.status === 'accepted' 
                    ? 'bg-green-100 text-green-800'
                    : selectedRequest.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedRequest.status === 'accepted' ? '✓ Accepted' :
                   selectedRequest.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                </span>
              </div>
              {/* Tier Badge */}
              {selectedRequest.status === 'accepted' && selectedRequest.tier && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                    <UserIcon className="h-3 w-3 mr-1" />
                    Tier {selectedRequest.tier}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-2 sm:p-3">
              {/* Alumni Name */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
                {selectedRequest.alumni?.fullName || 'Alumni'}
              </h3>
              {/* Alumni Details */}
              <div className="space-y-1 mb-2">
                {selectedRequest.alumni?.graduationYear && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedRequest.alumni.graduationYear}
                  </div>
                )}
                {selectedRequest.alumni?.course && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                    {selectedRequest.alumni.course}
                  </div>
                )}
                {selectedRequest.alumni?.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedRequest.alumni.currentJobTitle}
                  </div>
                )}
                {selectedRequest.alumni?.companyName && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedRequest.alumni.companyName}
                  </div>
                )}
              </div>
              {/* Your Request Message */}
              {selectedRequest.descriptionbyUser && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Your Request Message</h4>
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
              {/* Alumni's Response */}
              {selectedRequest.status === 'accepted' && selectedRequest.descriptionbyAlumni && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Alumni's Response</h4>
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyAlumni}
                  </div>
                </div>
              )}
              {/* Contact Information */}
              {selectedRequest.status === 'accepted' ? (
                contactLoading ? (
                  <div className="mb-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="animate-pulse flex items-center space-x-3">
                        <div className="h-4 w-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-spin"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </div>
                      <div className="animate-pulse flex items-center space-x-3">
                        <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-spin"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="animate-pulse flex items-center space-x-3">
                        <div className="h-4 w-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-spin"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </div>
                    </div>
                  </div>
                ) : contactError ? (
                  <div className="mb-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-600 text-sm">Unable to load contact information</p>
                      <button 
                        onClick={() => {
                          setContactLoading(true);
                          setContactError(false);
                          setTimeout(() => setContactLoading(false), 1500);
                        }}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
                    <div className="space-y-1">
                      {selectedRequest.alumni.email && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={`mailto:${selectedRequest.alumni.email}`}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            {selectedRequest.alumni.email}
                          </a>
                        </div>
                      )}
                      {selectedRequest.alumni.linkedinUrl && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={selectedRequest.alumni.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {selectedRequest.alumni.phoneNumber && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <a 
                            href={`tel:${selectedRequest.alumni.phoneNumber}`}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            {selectedRequest.alumni.phoneNumber}
                          </a>
                        </div>
                      )}
                      {!selectedRequest.alumni.email && !selectedRequest.alumni.linkedinUrl && !selectedRequest.alumni.phoneNumber && (
                        <p className="text-gray-500 text-xs sm:text-sm">No contact information available</p>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
                  <div className="space-y-1 filter blur-sm pointer-events-none">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-400">••••••••@••••••••.com</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-400">LinkedIn Profile</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-400">+•• ••• ••• ••••</span>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-xs sm:text-sm text-gray-500 mb-3">
                      {selectedRequest.status === 'pending' 
                        ? 'Contact information will be available once your request is accepted'
                        : selectedRequest.status === 'rejected'
                        ? 'Contact information is not available for rejected requests'
                        : 'Contact information will be available once your request is accepted'
                      }
                    </p>
                  </div>
                </div>
              )}
              {/* Close Button */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StudentDashboard; 