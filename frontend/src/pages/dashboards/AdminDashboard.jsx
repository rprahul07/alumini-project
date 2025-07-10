import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import apiService from "../../middleware/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import AlumniEventSubmissions from "../../components/AlumniEventSubmissions";
import JobCard from '../../components/opportunities/JobCard';
import JobDetailsModal from '../../components/opportunities/JobDetailsModal';
import axios from '../../config/axios';

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role === "admin") {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/admin/login", { replace: true });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin/login", { replace: true });
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 text-lg mt-4">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
};

// --- Sidebar Component ---
const Sidebar = ({ onNavigate, onEventSectionChange, activeView, eventSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserManagementExpanded, setIsUserManagementExpanded] =
    useState(false);
  const [isEventManagementExpanded, setIsEventManagementExpanded] = useState(false);
  // Main menu items
  const mainMenuItems = [
    { title: "Dashboard", icon: FiHome, view: "dashboard" },
    { title: "Job Approvals", icon: FiBriefcase, view: "job-approvals" },
  ];

  // User Management submenu items
  const userManagementItems = [
    { title: "Student", icon: FiBook, view: "students" },
    { title: "Alumni", icon: FiBriefcase, view: "alumni" },
    { title: "Faculty", icon: FiUser, view: "faculty" },
  ];

  const eventManagementItems = [
    { title: "Alumni Events", icon: FiBriefcase, view: "event-management", section: "alumni" },
    { title: "Faculty Events", icon: FiUser, view: "event-management", section: "faculty" },
    { title: "Admin Events", icon: FiShield, view: "event-management", section: "admin" },
  ];

  const handleNavigationClick = (view, section) => {
    onNavigate(view);
    if (view === "event-management" && section) {
      onEventSectionChange(section);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        className={`fixed inset-y-6 left-0 w-64 bg-white  shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:z-auto rounded-r-2xl lg:rounded-2xl p-4`}
      >
        <div className="flex justify-end lg:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Dashboard Menu
          </h3>
          <nav>
            <ul>
              {mainMenuItems.map((item) => (
                <li key={item.title} className="mb-3">
                  <button
                    onClick={() => handleNavigationClick(item.view)}
                    className={`w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group ${activeView === item.view ? 'bg-indigo-100' : ''}`}
                  >
                    <item.icon className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                </li>
              ))}
              {/* User Management Dropdown */}
              <li className="mb-3">
                <button
                  onClick={() => setIsUserManagementExpanded(!isUserManagementExpanded)}
                  className="w-full text-left flex items-center justify-between space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <FiUsers className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                    <span className="font-medium">User Management</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${isUserManagementExpanded ? "rotate-90" : ""}`}
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
                {isUserManagementExpanded && (
                  <ul className="ml-8 mt-2 space-y-2">
                    {userManagementItems.map((item) => (
                      <li key={item.title}>
                        <button
                          onClick={() => handleNavigationClick(item.view)}
                          className={`w-full text-left flex items-center space-x-3 p-2 text-gray-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-200 ${activeView === item.view ? 'bg-indigo-100' : ''}`}
                        >
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">{item.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {/* Event Management Dropdown */}
              <li className="mb-3">
                <button
                  onClick={() => setIsEventManagementExpanded(!isEventManagementExpanded)}
                  className="w-full text-left flex items-center justify-between space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <FiBell className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                    <span className="font-medium">Event Management</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${isEventManagementExpanded ? "rotate-90" : ""}`}
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
                {isEventManagementExpanded && (
                  <ul className="ml-8 mt-2 space-y-2">
                    {eventManagementItems.map((item) => (
                      <li key={item.title}>
                        <button
                          onClick={() => handleNavigationClick(item.view, item.section)}
                          className={`w-full text-left flex items-center space-x-3 p-2 text-gray-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-200 ${(activeView === item.view && eventSection === item.section) ? 'bg-indigo-100' : ''}`}
                        >
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">{item.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="mb-3">
                <button
                  onClick={() => onNavigate("settings")}
                  className="w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <FiSettings className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                  <span className="font-medium">Settings</span>
                </button>
              </li>
              <li className="mb-3">
                <button
                  onClick={() => onNavigate("help")}
                  className="w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <FiHelpCircle className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                  <span className="font-medium">Help</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

// --- Mock ProfileCard Component ---
// A component to display user profile completion status.
const ProfileCard = ({ isProfileComplete }) => {
  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl shadow-inner">
      <div
        className={`p-3 rounded-full ${
          isProfileComplete ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isProfileComplete ? (
          <svg
            className="h-6 w-6 text-green-600"
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
          className={`text-sm ${
            isProfileComplete ? "text-green-700" : "text-red-700"
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
        return "bg-yellow-100 text-yellow-800";
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
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
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
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterStatus === status
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
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
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 px-3 py-1 bg-indigo-50 rounded-lg text-xs"
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

// --- Announcements and Events Section Component ---
const AnnouncementsSection = ({ announcements, onCreate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">
          Announcements & Events
        </h2>
        <button
          onClick={onCreate}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create New</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <FiBell className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">
                  {announcement.title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  {announcement.content}
                </p>
                <div className="flex items-center text-gray-500 text-xs mt-2 space-x-3">
                  <span>{announcement.date}</span>
                  <span>|</span>
                  <span>{announcement.type}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md text-sm">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No announcements or events yet. Click "Create New" to add one!
          </div>
        )}
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

  const handleConfirmAction = () => {
    if (modalAction === "delete") {
      onDeleteUser(selectedUserId, userType);
    } else if (modalAction === "update") {
      navigate(`/admin/edit-user/${userType}/${selectedUserId}`);
    }
    setIsConfirmModalOpen(false);
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
    { key: "department", label: "Major" }, // Specific to students
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
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
        {userType} Management
      </h2>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={`Search ${userType}...`}
          className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {displayedHeaders.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
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
                              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 px-3 py-1 bg-indigo-50 rounded-lg text-xs"
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
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 px-3 py-1 bg-red-50 rounded-lg text-xs"
                            >
                              Delete by ID
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

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalAction === "delete" ? "Confirm Deletion" : "Confirm Update"}
        message={
          modalAction === "delete"
            ? `Are you sure you want to delete ${selectedUserName}? This action cannot be undone.`
            : `Are you sure you want to update ${selectedUserName}?`
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};

// --- AdminDashboard Component ---
const AdminDashboard = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const [activeView, setActiveView] = useState("dashboard");
  const [eventSection, setEventSection] = useState("alumni");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Dummy data for Announcements & Events (still part of dashboard overview)
  const [announcements, setAnnouncements] = useState([
    {
      id: "a1",
      title: "Community Guidelines Update",
      content:
        "Our community guidelines have been updated. Please review the new terms.",
      date: "2024-05-15",
      type: "Announcement",
    },
    {
      id: "a2",
      title: "Webinar: Mastering Mentorship",
      content:
        "Join our free webinar on effective mentorship strategies on June 20th.",
      date: "2024-06-20",
      type: "Event",
    },
    {
      id: "a3",
      title: "Platform Maintenance Notice",
      content:
        "Scheduled maintenance will occur on June 10th from 2 AM to 4 AM UTC.",
      date: "2024-06-10",
      type: "Announcement",
    },
  ]);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      alert('Failed to approve job.');
    }
  };
  const handleRejectJob = async (id) => {
    try {
      await axios.patch(`/api/job/${id}/status`, { status: 'rejected' });
      setJobs(jobs.filter(job => job.id !== id));
    } catch {
      alert('Failed to reject job.');
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Fetch students
  useEffect(() => {
    setStudentsLoading(true);
    apiService.raw.get("/api/student/getall")
      .then(res => setStudents(res.data?.data?.students || []))
      .catch(() => setStudents([]))
      .finally(() => setStudentsLoading(false));
  }, []);

  // Fetch alumni
  useEffect(() => {
    setAlumniLoading(true);
    apiService.raw.get("/api/alumni/getall")
      .then(res => setAlumni(res.data?.data?.alumni || []))
      .catch(() => setAlumni([]))
      .finally(() => setAlumniLoading(false));
  }, []);

  // Fetch faculty
  useEffect(() => {
    setFacultyLoading(true);
    apiService.raw.get("/api/faculty/getall")
      .then(res => setFaculty(res.data?.data?.faculty || []))
      .catch(() => setFaculty([]))
      .finally(() => setFacultyLoading(false));
  }, []);

  const handleVerifyUser = (id) => {
    setUsersToVerify((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Approved" } : user
      )
    );
  };

  const handleRejectUser = (id) => {
    setUsersToVerify((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Rejected" } : user
      )
    );
  };

  const handleCreateAnnouncement = () => {
    // This will open a modal or navigate to a creation page in a real app.
    // For this demo, we'll use a placeholder modal.
    alert(
      "Create New Announcement/Event functionality goes here. A proper modal for input would appear!"
    );
  };

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
      await apiService.raw.delete(endpoint);
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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10 text-gray-500">Loading data...</div>
      );
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div className="mb-4 mt-3 bg-gradient-to-r from-indigo-100 via-white to-indigo-50 rounded-xl p-5 flex flex-col min-h-[96px]">
              <h1 className="text-lg font-semibold text-gray-700 leading-tight">
                Welcome back, <span className="text-indigo-500 font-bold">{user?.fullName || 'Admin'}</span>!
              </h1>
              <p className="text-base text-gray-500 mt-1">
                Your admin dashboard for managing users, events, and more.
              </p>
            </div>

            {/* --- Statistics Cards (Redesigned) --- */}
            {dashboardStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {/* Total Users */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <FiUsers className="text-indigo-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalUsers}</div>
                    <div className="text-gray-500 text-sm">Total Users</div>
                  </div>
                </div>
                {/* Alumni */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-green-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FiBriefcase className="text-green-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalAlumni}</div>
                    <div className="text-gray-500 text-sm">Alumni</div>
                  </div>
                </div>
                {/* Students */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-blue-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FiBook className="text-blue-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalStudents}</div>
                    <div className="text-gray-500 text-sm">Students</div>
                  </div>
                </div>
                {/* Faculty */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-yellow-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FiUser className="text-yellow-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalFaculty}</div>
                    <div className="text-gray-500 text-sm">Faculty</div>
                  </div>
                </div>
                {/* Admins */}
                <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-pink-500 transition-transform transform hover:scale-105">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <FiShield className="text-pink-600 text-2xl" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{dashboardStats.totalAdmins}</div>
                    <div className="text-gray-500 text-sm">Admins</div>
                  </div>
                </div>
              </div>
            )}
            {/* --- End Statistics Cards (Redesigned) --- */}

            <UserVerificationTable
              users={usersToVerify}
              onVerify={handleVerifyUser}
              onReject={handleRejectUser}
            />

            <AnnouncementsSection
              announcements={announcements}
              onCreate={handleCreateAnnouncement}
            />
          </>
        );
      case "job-approvals":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Job Approvals</h2>
            {jobsLoading ? (
              <div className="text-center text-gray-400 py-10">Loading jobs...</div>
            ) : jobsError ? (
              <div className="text-center text-red-500 py-10">{jobsError}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">No pending jobs for approval.</div>
                ) : (
                  jobs.map(job => (
                    <div key={job.id} className="relative">
                      <JobCard
                        job={job}
                        onClick={() => { setSelectedJob(job); setShowModal(true); }}
                        onApply={() => { setSelectedJob(job); setShowModal(true); }}
                      />
                      <div className="absolute bottom-2 left-2 flex gap-2">
                        <button
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={e => { e.stopPropagation(); handleApproveJob(job.id); }}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={e => { e.stopPropagation(); handleRejectJob(job.id); }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            <JobDetailsModal
              job={selectedJob}
              open={showModal}
              onClose={() => setShowModal(false)}
              onApply={() => {}}
            />
          </div>
        );
      case "students":
        return (
          studentsLoading ? (
            <div className="text-center py-10 text-gray-500">Loading students...</div>
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
            <div className="text-center py-10 text-gray-500">Loading alumni...</div>
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
            <div className="text-center py-10 text-gray-500">Loading faculty...</div>
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
        return (
          <AlumniEventSubmissions sectionDefault={eventSection} />
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
  };

  return (
    <>
      <Navbar />
    <div className="min-h-screen font-roboto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <aside className="lg:col-span-1 space-y-4" aria-label="Sidebar and profile section">
            <Sidebar
              onNavigate={setActiveView}
              onEventSectionChange={setEventSection}
              activeView={activeView}
              eventSection={eventSection}
            />
          </aside>
            <main className="lg:col-span-3 space-y-5 py-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
    </>
  );
};  

// --- Main App Component ---
export default function App() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}