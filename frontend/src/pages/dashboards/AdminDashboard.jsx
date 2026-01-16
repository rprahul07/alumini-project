import React, { useState, useEffect, memo, useMemo, useCallback, lazy, Suspense } from "react";
import AdminContactMessages from '../../components/admin/AdminContactMessages';
import AdminAnnouncements from './AdminAnnouncements';

// Lazy load heavy admin components for better performance
const AdminTestimonials = lazy(() => import('../../components/admin/AdminTestimonials'));
const AdminGallery = lazy(() => import('../../components/admin/AdminGallery'));
const AdminSpotlight = lazy(() => import('../../components/admin/AdminSpotlight'));
import { useAuth } from "../../contexts/AuthContext"; // ✅ Added AuthContext
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBook,
  FiBriefcase,
  FiSettings,
  FiHelpCircle,
  FiBell,
  FiBarChart2,
  FiShield,
  FiSearch,
  FiPlus,
  FiHome,
  FiUser,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiImage,
  FiStar,
  FiAlertCircle,
} from "react-icons/fi";
import apiService from "../../middleware/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Navbar from "../../components/Navbar";
import AdminEventsPage from '../../components/AdminEventsPage';
import JobCard from '../../components/opportunities/JobCard';
import JobDetailsModal from '../../components/opportunities/JobDetailsModal';
import axios from '../../config/axios';
import MyActivityCard from '../../components/MyActivityCard';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../components/ConfirmDialog';

// Loading component for lazy-loaded components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="text-gray-600 text-lg mt-4 font-medium">Loading...</p>
    </div>
  </div>
);

const AdminOpportunities = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [rejectedJobs, setRejectedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingJobs();
    } else if (activeTab === 'approved') {
      fetchApprovedJobs();
    } else if (activeTab === 'rejected') {
      fetchRejectedJobs();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/job/admin/pending');
      setPendingJobs(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch pending jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/job/', { params: { status: 'approved', limit: 100 } });
      setApprovedJobs(res.data.data.jobs || []);
    } catch (err) {
      toast.error('Failed to fetch approved jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectedJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/job/', { params: { status: 'rejected', limit: 100 } });
      setRejectedJobs(res.data.data.jobs || []);
    } catch (err) {
      toast.error('Failed to fetch rejected jobs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch full job details when viewing
  const handleView = async (job) => {
    setModalLoading(true);
    setModalOpen(true);
    try {
      const res = await axios.get(`/api/job/${job.id}`);
      setSelectedJob(res.data.data);
    } catch {
      setSelectedJob(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  const handleAction = async (newStatus) => {
    if (!selectedJob) return;
    setActionLoading(true);
    try {
      await axios.patch(`/api/job/${selectedJob.id}/status`, { status: newStatus });
      setPendingJobs(jobs => jobs.filter(j => j.id !== selectedJob.id));
      toast.success(`Job ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully.`);
      handleCloseModal();
    } catch (err) {
      toast.error('Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    try {
      await axios.delete(`/api/job/${deleteJobId}`);
      toast.success('Job deleted successfully!');
      setShowDeleteDialog(false);
      setDeleteJobId(null);
      // Refresh jobs
      if (activeTab === 'pending') fetchPendingJobs();
      else if (activeTab === 'approved') fetchApprovedJobs();
      else if (activeTab === 'rejected') fetchRejectedJobs();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete job.'
      );
      setShowDeleteDialog(false);
      setDeleteJobId(null);
    }
  };

  // Table data and columns based on tab
  let jobsToShow = [];
  if (activeTab === 'pending') jobsToShow = pendingJobs;
  else if (activeTab === 'approved') jobsToShow = approvedJobs;
  else if (activeTab === 'rejected') jobsToShow = rejectedJobs;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'approved'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : jobsToShow.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No {activeTab} job requests.</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {jobsToShow.map(job => (
            <div key={job.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{job.jobTitle}</h4>
                  <p className="text-sm text-gray-600 truncate">{job.companyName}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>By: {job.user?.fullName || 'Unknown'}</span>
                    <span>•</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => handleView(job)}
                  >
                    View
                  </button>
                  {job.status === 'pending' && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      onClick={async () => {
                        setActionLoading(job.id);
                        try {
                          await axios.patch(`/api/job/${job.id}/status`, { status: 'approved' });
                          setPendingJobs(jobs => jobs.filter(j => j.id !== job.id));
                          toast.success('Job approved successfully.');
                        } catch {
                          toast.error('Failed to approve job.');
                        } finally {
                          setActionLoading(false);
                        }
                      }}
                      disabled={actionLoading === job.id}
                    >
                      {actionLoading === job.id ? 'Accepting...' : 'Accept'}
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => { setDeleteJobId(job.id); setShowDeleteDialog(true); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal for job details and actions */}
      {modalOpen && (
        <JobDetailsModal
          job={selectedJob}
          open={modalOpen}
          onClose={handleCloseModal}
          onJobEdit={fetchApprovedJobs}
          onJobDelete={fetchApprovedJobs}
          showAlert={toast}
        />
      )}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={handleDeleteJob}
        onCancel={() => { setShowDeleteDialog(false); setDeleteJobId(null); }}
      />
    </div>
  );
};

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // ✅ Use AuthContext
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) { // ✅ Wait for AuthContext to finish loading
      if (!user || user.role !== 'admin') {
        navigate("/admin/login", { replace: true });
      }
      setIsChecking(false);
    }
  }, [user, loading, navigate]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4 font-medium">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Navigate will redirect
  }

  return children;
};

// --- Enhanced Sidebar Component ---
const Sidebar = ({ onNavigate, activeView, isOpen, setIsOpen }) => {
  const [isUserManagementExpanded, setIsUserManagementExpanded] = useState(false);

  // Main menu items - reorganized for better admin workflow
  const mainMenuItems = [
    { title: "Overview", icon: FiHome, view: "dashboard", description: "Dashboard stats and quick actions" },
    { title: "Users", icon: FiUsers, view: "user-management", description: "Manage all users", hasSubmenu: true },
    { title: "Content", icon: FiImage, view: "content-management", description: "Manage content", hasSubmenu: true },
    { title: "Events", icon: FiBarChart2, view: "event-management", description: "Event management" },
    { title: "Messages", icon: FiMessageSquare, view: "contact-messages", description: "Contact inquiries" },
  ];

  // User Management submenu items
  const userManagementItems = [
    { title: "Students", icon: FiBook, view: "students", count: "students" },
    { title: "Alumni", icon: FiBriefcase, view: "alumni", count: "alumni" },
    { title: "Faculty", icon: FiUser, view: "faculty", count: "faculty" },
  ];

  // Content Management submenu items
  const contentManagementItems = [
    { title: "Announcements", icon: FiBell, view: "announcements" },
    { title: "Spotlight", icon: FiStar, view: "spotlight" },
    { title: "Gallery", icon: FiImage, view: "gallery" },
    { title: "Testimonials", icon: FiMessageSquare, view: "testimonials" },
  ];

  const handleNavigationClick = (view) => {
    onNavigate(view);
    setIsOpen(false);
  };

  const isUserManagementActive = ['students', 'alumni', 'faculty'].includes(activeView);
  const isContentManagementActive = ['announcements', 'spotlight', 'gallery', 'testimonials'].includes(activeView);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 lg:inset-y-auto lg:left-auto lg:w-auto transition-transform duration-300 ease-in-out z-40 lg:z-auto rounded-r-2xl lg:rounded-2xl overflow-hidden`}
      >
        <div className="flex justify-end lg:hidden p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 h-full overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h3>
            <p className="text-sm text-gray-600">Content & User Management</p>
          </div>

          <nav className="space-y-2">
            {mainMenuItems.map((item) => (
              <div key={item.title}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => {
                        if (item.view === 'user-management') {
                          setIsUserManagementExpanded(!isUserManagementExpanded);
                        }
                      }}
                      className={`w-full text-left flex items-center justify-between p-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 group ${(item.view === 'user-management' && isUserManagementActive) ||
                        (item.view === 'content-management' && isContentManagementActive)
                        ? 'bg-primary-50 text-primary-700' : ''
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${(item.view === 'user-management' && isUserManagementExpanded) ||
                          (item.view === 'content-management' && isContentManagementActive)
                          ? "rotate-90" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* User Management Submenu */}
                    {item.view === 'user-management' && isUserManagementExpanded && (
                      <div className="ml-6 mt-2 space-y-1">
                        {userManagementItems.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleNavigationClick(subItem.view)}
                            className={`w-full text-left flex items-center justify-between p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${activeView === subItem.view ? 'bg-primary-100 text-primary-800' : ''
                              }`}
                          >
                            <div className="flex items-center space-x-2">
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Content Management Submenu */}
                    {item.view === 'content-management' && (
                      <div className="ml-6 mt-2 space-y-1">
                        {contentManagementItems.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleNavigationClick(subItem.view)}
                            className={`w-full text-left flex items-center space-x-2 p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${activeView === subItem.view ? 'bg-primary-100 text-primary-800' : ''
                              }`}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigationClick(item.view)}
                    className={`w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 group ${activeView === item.view ? 'bg-primary-50 text-primary-700' : ''
                      }`}
                  >
                    <item.icon className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
                    <div>
                      <span className="font-medium">{item.title}</span>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div >
      </aside >
    </>
  );
};

// --- Mock ProfileCard Component ---
// A component to display user profile completion status.
const ProfileCard = ({ isProfileComplete }) => {
  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl shadow-inner">
      <div
        className={`p-3 rounded-full ${isProfileComplete ? "bg-green-100" : "bg-red-100"
          }`}
      >
        {isProfileComplete ? (
          <svg
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Profile Status</h3>
        <p
          className={`text-sm ${isProfileComplete ? "text-green-700" : "text-red-700"
            }`}
        >
          {isProfileComplete
            ? "Your profile is complete!"
            : "Please complete your profile details."}
        </p>
      </div>
    </div>
  );
};

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full transform transition-all scale-100 opacity-100 duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- User Verification Table Component ---
const UserVerificationTable = ({ users, onVerify, onReject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-accent-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">User Verification</h2>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition-all ${filterStatus === status
              ? "bg-primary text-white hover:bg-primary-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {status} (
            {
              users.filter((u) => status === "All" || u.status === status)
                .length
            }
            )
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.status === "Pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onVerify(user.id)}
                          className="text-primary-600 hover:text-primary-900 transition-colors duration-200 px-3 py-1 bg-primary-50 rounded-lg text-xs"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => onReject(user.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 px-3 py-1 bg-red-50 rounded-lg text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No actions needed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- UserTableDisplay Component (for Student, Alumni, Faculty) ---
const UserTableDisplay = ({ userType, users, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'update'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleActionClick = (action, userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setModalAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {

    if (modalAction === 'update') {
      navigate(`/admin/edit-user/${userType}/${selectedUserId}`);
      setIsConfirmModalOpen(false);
    } else if (modalAction === 'delete') {
      try {
        await onDeleteUser(selectedUserId, userType);
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Failed to delete user');
      }
      setIsConfirmModalOpen(false);
    }
    setSelectedUserId(null);
    setSelectedUserName("");
    setModalAction(null);
  };

  const handleCancelAction = () => {
    setIsConfirmModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName("");
    setModalAction(null);
  };
  const getValueByKeyPath = (obj, keyPath) => {
    return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const headers = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    { key: "department", label: "Department" },
    { key: "major", label: "Major" }, // Specific to students
    { key: "alumni.graduationYear", label: "Graduation Year" }, // Specific to alumni
    { key: "position", label: "Position" }, // Specific to faculty
    { key: "actions", label: "Actions" },
  ];

  // Filter headers based on userType to only show relevant ones
  const displayedHeaders = headers.filter((header) => {
    if (header.key === "major" && userType !== "students") return false;
    if (header.key === "gradYear" && userType !== "alumni") return false;
    if (header.key === "position" && userType !== "faculty") return false;
    return header.key !== "userID" && header.key !== "password"; // Explicitly exclude
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {userType} Management
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${userType}...`}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden p-6">
        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.userId} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">{getValueByKeyPath(user, "fullName") || "-"}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'alumni' ? 'bg-green-100 text-green-800' :
                      user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'faculty' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {user.role || 'Unknown'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-20">Email:</span>
                      <span className="truncate">{getValueByKeyPath(user, "email") || "-"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-20">Phone:</span>
                      <span className="truncate">{getValueByKeyPath(user, "phoneNumber") || "-"}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium w-20">Dept:</span>
                      <span className="truncate">{getValueByKeyPath(user, "department") || "-"}</span>
                    </div>
                  </div>
                  {user.userId && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleActionClick("update", user.userId, user.fullName)}
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleActionClick("delete", user.userId, user.fullName)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {userType} found.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {displayedHeaders.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition-colors duration-200">
                  {displayedHeaders.map((header) => (
                    <td
                      key={`${user.userId}-${header.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {header.key === "actions" ? (
                        user.userId ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleActionClick(
                                  "update",
                                  user.userId,
                                  user.fullName
                                )
                              }
                              className="text-primary-600 hover:text-primary-900 transition-colors duration-200 px-3 py-1 bg-primary-50 rounded-lg text-xs font-medium"
                            >
                              Update
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(
                                  "delete",
                                  user.userId,
                                  user.fullName
                                )
                              }
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 px-3 py-1 bg-red-50 rounded-lg text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No userId
                          </span>
                        )
                      ) : (
                        getValueByKeyPath(user, header.key) || "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={displayedHeaders.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No {userType} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={isConfirmModalOpen}
        title={modalAction === "delete" ? "Confirm Deletion" : "Confirm Update"}
        message={modalAction === "delete"
          ? `Are you sure you want to delete ${selectedUserName}? This action cannot be undone.`
          : `Are you sure you want to update ${selectedUserName}?`}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setIsConfirmModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserName("");
          setModalAction(null);
        }}
      />
    </div>
  );
};

// --- AdminDashboard Component ---
const AdminDashboard = memo(() => {
  const { user, isAdmin } = useAuth(); // ✅ Use AuthContext instead of localStorage
  const [activeView, setActiveView] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  // Memoize navigation handler
  const handleNavigation = useCallback((view) => {
    setActiveView(view);
  }, []);
  // const [eventSection, setEventSection] = useState("alumni"); // Removed event management
  const [dashboardStats, setDashboardStats] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true); // Only for initial dashboard fetch
  const [error, setError] = useState(null);

  // Data states
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [alumni, setAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  // Dummy data for User Verification (still part of dashboard overview)
  const [usersToVerify, setUsersToVerify] = useState([
    {
      id: "u1",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      status: "Pending",
    },
    {
      id: "u2",
      name: "Bob Williams",
      email: "bob.w@example.com",
      status: "Approved",
    },
    {
      id: "u3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      status: "Pending",
    },
    {
      id: "u4",
      name: "Diana Prince",
      email: "diana.p@example.com",
      status: "Rejected",
    },
    {
      id: "u5",
      name: "Eve Adams",
      email: "eve.a@example.com",
      status: "Pending",
    },
    {
      id: "u6",
      name: "Frank White",
      email: "frank.w@example.com",
      status: "Approved",
    },
    {
      id: "u7",
      name: "Grace Hopper",
      email: "grace.h@example.com",
      status: "Pending",
    },
    {
      id: "u8",
      name: "Henry Ford",
      email: "henry.f@example.com",
      status: "Approved",
    },
  ]);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const [inputCallback, setInputCallback] = useState(null);

  const fetchPendingJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const res = await axios.get('/api/job/', { params: { status: 'pending' } });
      setJobs(res.data.data.jobs);
    } catch (err) {
      setJobsError('Failed to load pending jobs.');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'job-approvals') {
      fetchPendingJobs();
    }
    // eslint-disable-next-line
  }, [activeView]);

  const handleApproveJob = async (id) => {
    try {
      await axios.patch(`/api/job/${id}/status`, { status: 'approved' });
      setJobs(jobs.filter(job => job.id !== id));
    } catch {
      toast.error('Failed to approve job.');
    }
  };
  const handleRejectJob = async (id) => {
    try {
      await axios.patch(`/api/job/${id}/status`, { status: 'rejected' });
      setJobs(jobs.filter(job => job.id !== id));
    } catch {
      toast.error('Failed to reject job.');
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setDashboardLoading(true);
      setError(null);
      try {
        const [statsRes, profileRes] = await Promise.all([
          apiService.raw.get("/api/admin/dashboard-stats"),
          apiService.raw.get("/api/admin/profile"),
        ]);
        setDashboardStats(statsRes.data.data);
        setAdminProfile(profileRes.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch admin data");
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Fetch all user data in parallel for better performance
  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        setStudentsLoading(true);
        setAlumniLoading(true);
        setFacultyLoading(true);

        const [studentsRes, alumniRes, facultyRes] = await Promise.all([
          apiService.raw.get("/api/student/getall"),
          apiService.raw.get("/api/alumni/getall"),
          apiService.raw.get("/api/faculty/getall")
        ]);

        setStudents(studentsRes.data?.data?.students || []);
        setAlumni(alumniRes.data?.data?.alumni || []);
        setFaculty(facultyRes.data?.data?.faculty || []);
      } catch (error) {
        setStudents([]);
        setAlumni([]);
        setFaculty([]);
      } finally {
        setStudentsLoading(false);
        setAlumniLoading(false);
        setFacultyLoading(false);
      }
    };

    fetchAllUserData();
  }, []);

  const handleVerifyUser = useCallback((id) => {
    setUsersToVerify((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Approved" } : user
      )
    );
  }, []);

  const handleRejectUser = useCallback((id) => {
    setUsersToVerify((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Rejected" } : user
      )
    );
  }, []);

  // Only re-fetch the affected list after update/delete
  const refetchStudents = () => {
    setStudentsLoading(true);
    apiService.raw.get("/api/student/getall")
      .then(res => setStudents(res.data?.data?.students || []))
      .catch(() => setStudents([]))
      .finally(() => setStudentsLoading(false));
  };
  const refetchAlumni = () => {
    setAlumniLoading(true);
    apiService.raw.get("/api/alumni/getall")
      .then(res => setAlumni(res.data?.data?.alumni || []))
      .catch(() => setAlumni([]))
      .finally(() => setAlumniLoading(false));
  };
  const refetchFaculty = () => {
    setFacultyLoading(true);
    apiService.raw.get("/api/faculty/getall")
      .then(res => setFaculty(res.data?.data?.faculty || []))
      .catch(() => setFaculty([]))
      .finally(() => setFacultyLoading(false));
  };

  const handleDeleteUser = async (id, type) => {

    if (!id) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      let endpoint = "";
      switch (type) {
        case "students":
          endpoint = `/api/student/${id}`;
          break;
        case "alumni":
          endpoint = `/api/alumni/${id}`;
          break;
        case "faculty":
          endpoint = `/api/faculty/${id}`;
          break;
        default:
          throw new Error("Invalid user type");
      }

      const response = await apiService.raw.delete(endpoint);

      // Only re-fetch the affected list
      if (type === "students") refetchStudents();
      if (type === "alumni") refetchAlumni();
      if (type === "faculty") refetchFaculty();

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to delete user. Please try again."
      );
    }
  };

  const handleUpdateUser = async (id, type, updatedData) => {
    if (!id) {
      toast.error("Invalid user ID");
      return;
    }
    try {
      let endpoint = "";
      switch (type) {
        case "students":
          endpoint = `/api/student/${id}`;
          break;
        case "alumni":
          endpoint = `/api/alumni/${id}`;
          break;
        case "faculty":
          endpoint = `/api/faculty/${id}`;
          break;
        default:
          throw new Error("Invalid user type");
      }
      await apiService.raw.patch(endpoint, updatedData);
      // Only re-fetch the affected list
      if (type === "students") refetchStudents();
      if (type === "alumni") refetchAlumni();
      if (type === "faculty") refetchFaculty();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to update user. Please try again."
      );
    }
  };

  const renderContent = useCallback(() => {
    if (dashboardLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 text-lg mt-4 font-medium">Loading dashboard...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
              <FiAlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        </div>
      );
    }
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullName || 'Admin'}!
              </h1>
              <p className="text-gray-600">
                Manage your platform content and users efficiently.
              </p>
            </div>
            {/* --- Enhanced Statistics Cards --- */}
            {dashboardStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FiUsers className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Alumni */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Alumni</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalAlumni}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FiBriefcase className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Students */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Students</p>
                      <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <FiBook className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </div>

              </div>
            )}
            {/* --- End Statistics Cards --- */}

            {/* Job Approvals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Job Approvals</h3>
                <span className="text-sm text-gray-500">Pending Review</span>
              </div>
              <AdminOpportunities />
            </div>
          </>
        );
      case "students":
        return (
          studentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 text-lg mt-4 font-medium">Loading students...</p>
              </div>
            </div>
          ) : (
            <UserTableDisplay
              userType="students"
              users={students}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )
        );
      case "alumni":
        return (
          alumniLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 text-lg mt-4 font-medium">Loading alumni...</p>
              </div>
            </div>
          ) : (
            <UserTableDisplay
              userType="alumni"
              users={alumni}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )
        );
      case "faculty":
        return (
          facultyLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 text-lg mt-4 font-medium">Loading faculty...</p>
              </div>
            </div>
          ) : (
            <UserTableDisplay
              userType="faculty"
              users={faculty}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )
        );
      case "event-management":
        return <AdminEventsPage />;
      case "contact-messages":
        return <AdminContactMessages />;
      case "announcements":
        return <AdminAnnouncements />;
      case "spotlight":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSpotlight />
          </Suspense>
        );
      case "testimonials":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminTestimonials />
          </Suspense>
        );
      case "gallery":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminGallery />
          </Suspense>
        );
      case "settings":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <p className="text-gray-700">Settings content will go here.</p>
          </div>
        );
      case "help":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Help & Support
            </h2>
            <p className="text-gray-700">Help content will go here.</p>
          </div>
        );
      default:
        return null;
    }
  }, [activeView, dashboardLoading, error, dashboardStats, adminProfile, students, studentsLoading, alumni, alumniLoading, faculty, facultyLoading, usersToVerify, handleVerifyUser, handleRejectUser, handleUpdateUser, handleDeleteUser]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-8">
            <aside className="lg:col-span-1" aria-label="Admin sidebar">
              <Sidebar
                onNavigate={handleNavigation}
                activeView={activeView}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </aside>
            <main className="lg:col-span-3">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
      {inputModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg shadow-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">{inputTitle}</h3>
            </div>
            <div className="mb-6 text-gray-700 text-sm sm:text-base">
              <label className="block mb-2 font-semibold">{inputLabel}</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setInputModalOpen(false)}
                className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => { setInputModalOpen(false); if (inputCallback) inputCallback(inputValue); }}
                className="rounded-full px-4 py-1.5 font-semibold bg-primary text-white hover:bg-primary-700 transition-colors w-full sm:w-auto"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// --- Main App Component ---
export default function App() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}