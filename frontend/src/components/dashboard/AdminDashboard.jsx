import React, { createContext, useContext, useState, useEffect } from 'react';
import { Users, GraduationCap, Briefcase, Settings, HelpCircle, BellRing, BarChart2, ShieldCheck, Search, Plus, Home, User } from 'lucide-react'; // Using lucide-react for icons
import apiService from '../../middleware/api';

// --- Mock AuthContext ---
// This context provides a mock authentication state for the dashboard.
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  // Mock user data for demonstration purposes
  const [user, setUser] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '123-456-7890',
    role: 'admin', // Set role to 'admin' for testing protected routes
    avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=AU' // Placeholder avatar
  });

  // You would typically have sign-in/sign-out logic here
  const signIn = (userData) => setUser(userData);
  const signOut = () => setUser(null);

  const value = { user, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- ProtectedRoute Component ---
// This component acts as a route guard, ensuring only admin users can access the dashboard.
const ProtectedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async auth check
    const checkAuth = setTimeout(() => {
      if (user && allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsLoading(false);
    }, 100); // Small delay to simulate auth loading

    return () => clearTimeout(checkAuth);
  }, [user, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-8 rounded-lg shadow-xl m-4">
        <h2 className="text-4xl font-bold mb-4">Access Denied</h2>
        <p className="text-xl">You do not have the necessary permissions to view this page.</p>
        <p className="mt-4 text-gray-600">Please log in with an administrator account.</p>
      </div>
    );
  }

  return children;
};

// --- Mock Navbar Component ---
// A simple navigation bar for the application.
const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center rounded-b-2xl z-10 relative">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold text-indigo-600">Admin Panel</span>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-2">
            <img
              className="h-8 w-8 rounded-full border-2 border-indigo-300"
              src={user.avatar}
              alt="User Avatar"
            />
            <span className="font-medium text-gray-700 hidden sm:block">{user.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">Guest</span>
        )}
      </div>
    </nav>
  );
};

// --- Mock Sidebar Component ---
// A responsive sidebar with navigation links for the dashboard.
const Sidebar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserManagementExpanded, setIsUserManagementExpanded] = useState(false);

  // Main menu items
  const mainMenuItems = [
    { title: 'Dashboard', icon: Home, view: 'dashboard' },
  ];

  // User Management submenu items
  const userManagementItems = [
    { title: 'Student', icon: GraduationCap, view: 'students' },
    { title: 'Alumni', icon: Briefcase, view: 'alumni' },
    { title: 'Faculty', icon: User, view: 'faculty' },
  ];

  const handleNavigationClick = (view) => {
    onNavigate(view);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:z-auto rounded-r-2xl lg:rounded-none p-4`}
      >
        <div className="flex justify-end lg:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Dashboard Menu</h3>
          <nav>
            <ul>
              {mainMenuItems.map((item) => (
                <li key={item.title} className="mb-3">
                  <button
                    onClick={() => handleNavigationClick(item.view)}
                    className="w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                  >
                    <item.icon className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                </li>
              ))}
              <li className="mb-3">
                <button
                  onClick={() => setIsUserManagementExpanded(!isUserManagementExpanded)}
                  className="w-full text-left flex items-center justify-between space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                    <span className="font-medium">User Management</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isUserManagementExpanded ? 'rotate-90' : ''
                    }`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {isUserManagementExpanded && (
                  <ul className="ml-8 mt-2 space-y-2">
                    {userManagementItems.map((item) => (
                      <li key={item.title}>
                        <button
                          onClick={() => handleNavigationClick(item.view)}
                          className="w-full text-left flex items-center space-x-3 p-2 text-gray-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-200"
                        >
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm">{item.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {/* Other potential static menu items if needed */}
              <li className="mb-3">
                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <Settings className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                  <span className="font-medium">Settings</span>
                </button>
              </li>
              <li className="mb-3">
                <button
                  onClick={() => onNavigate('help')}
                  className="w-full text-left flex items-center space-x-3 p-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group"
                >
                  <HelpCircle className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
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
      <div className={`p-3 rounded-full ${isProfileComplete ? 'bg-green-100' : 'bg-red-100'}`}>
        {isProfileComplete ? (
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">Profile Status</h3>
        <p className={`text-sm ${isProfileComplete ? 'text-green-700' : 'text-red-700'}`}>
          {isProfileComplete ? 'Your profile is complete!' : 'Please complete your profile details.'}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">User Verification</h2>
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
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
        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status} ({users.filter(u => status === 'All' || u.status === status).length})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.status === 'Pending' ? (
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
                        <span className="text-gray-500 text-xs">No actions needed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
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
        <h2 className="text-2xl font-bold text-gray-900">Announcements & Events</h2>
        <button
          onClick={onCreate}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Create New</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <BellRing className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                <p className="text-gray-600 mt-1 text-sm">{announcement.content}</p>
                <div className="flex items-center text-gray-500 text-xs mt-2 space-x-3">
                  <span>{announcement.date}</span>
                  <span>|</span>
                  <span>{announcement.type}</span>
                </div>
              </div>
              <div className="flex-shrink-0 flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md text-sm">Edit</button>
                <button className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md text-sm">Delete</button>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'update'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');


  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleActionClick = (action, userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setModalAction(action);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (modalAction === 'delete') {
      onDeleteUser(selectedUserId, userType);
    } else if (modalAction === 'update') {
      // In a real app, this would open a form/modal to edit the user
      alert(`Simulating update for user ID: ${selectedUserId} (${selectedUserName}). A form/modal would appear here.`);
    }
    setIsConfirmModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName('');
    setModalAction(null);
  };

  const handleCancelAction = () => {
    setIsConfirmModalOpen(false);
    setSelectedUserId(null);
    setSelectedUserName('');
    setModalAction(null);
  };

  const headers = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department' },
    { key: 'major', label: 'Major' }, // Specific to students
    { key: 'gradYear', label: 'Graduation Year' }, // Specific to alumni
    { key: 'position', label: 'Position' }, // Specific to faculty
    { key: 'actions', label: 'Actions' },
  ];

  // Filter headers based on userType to only show relevant ones
  const displayedHeaders = headers.filter(header => {
    if (header.key === 'major' && userType !== 'students') return false;
    if (header.key === 'gradYear' && userType !== 'alumni') return false;
    if (header.key === 'position' && userType !== 'faculty') return false;
    return header.key !== 'userID' && header.key !== 'password'; // Explicitly exclude
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
        {userType} Management
      </h2>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
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
              {displayedHeaders.map(header => (
                <th key={header.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider first:rounded-tl-xl last:rounded-tr-xl">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  {displayedHeaders.map(header => (
                    <td key={`${user.id}-${header.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {header.key === 'actions' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleActionClick('update', user.id, user.fullName)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 px-3 py-1 bg-indigo-50 rounded-lg text-xs"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleActionClick('delete', user.id, user.fullName)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200 px-3 py-1 bg-red-50 rounded-lg text-xs"
                          >
                            Delete by ID
                          </button>
                        </div>
                      ) : (
                        user[header.key] || ''
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={displayedHeaders.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No {userType} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title={modalAction === 'delete' ? 'Confirm Deletion' : 'Confirm Update'}
        message={modalAction === 'delete' ? `Are you sure you want to delete ${selectedUserName}? This action cannot be undone.` : `Are you sure you want to update ${selectedUserName}?`}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};


// --- AdminDashboard Component (User's original code with new integrations) ---
const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [faculty, setFaculty] = useState([]);

  // Dummy data for User Verification (still part of dashboard overview)
  const [usersToVerify, setUsersToVerify] = useState([
    { id: 'u1', name: 'Alice Johnson', email: 'alice.j@example.com', status: 'Pending' },
    { id: 'u2', name: 'Bob Williams', email: 'bob.w@example.com', status: 'Approved' },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie.b@example.com', status: 'Pending' },
    { id: 'u4', name: 'Diana Prince', email: 'diana.p@example.com', status: 'Rejected' },
    { id: 'u5', name: 'Eve Adams', email: 'eve.a@example.com', status: 'Pending' },
    { id: 'u6', name: 'Frank White', email: 'frank.w@example.com', status: 'Approved' },
    { id: 'u7', name: 'Grace Hopper', email: 'grace.h@example.com', status: 'Pending' },
    { id: 'u8', name: 'Henry Ford', email: 'henry.f@example.com', status: 'Approved' },
  ]);

  // Dummy data for Announcements & Events (still part of dashboard overview)
  const [announcements, setAnnouncements] = useState([
    { id: 'a1', title: 'Community Guidelines Update', content: 'Our community guidelines have been updated. Please review the new terms.', date: '2024-05-15', type: 'Announcement' },
    { id: 'a2', title: 'Webinar: Mastering Mentorship', content: 'Join our free webinar on effective mentorship strategies on June 20th.', date: '2024-06-20', type: 'Event' },
    { id: 'a3', title: 'Platform Maintenance Notice', content: 'Scheduled maintenance will occur on June 10th from 2 AM to 4 AM UTC.', date: '2024-06-10', type: 'Announcement' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentsRes, alumniRes, facultyRes] = await Promise.all([
          apiService.raw.get('/api/student/getall'),
          apiService.raw.get('/api/alumni/getall'),
          apiService.raw.get('/api/faculty/getall'),
        ]);
        setStudents(studentsRes.data.data.students || []);
        setAlumni(alumniRes.data.data.alumni || []);
        setFaculty(facultyRes.data.data.faculty || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVerifyUser = (id) => {
    setUsersToVerify(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, status: 'Approved' } : user
      )
    );
  };

  const handleRejectUser = (id) => {
    setUsersToVerify(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, status: 'Rejected' } : user
      )
    );
  };

  const handleCreateAnnouncement = () => {
    // This will open a modal or navigate to a creation page in a real app.
    // For this demo, we'll use a placeholder modal.
    alert('Create New Announcement/Event functionality goes here. A proper modal for input would appear!');
  };

  const handleDeleteUser = async (id, type) => {
    try {
      setLoading(true);
      let endpoint = '';
      if (type === 'students') {
        endpoint = `/api/student/${id}`;
      } else if (type === 'alumni') {
        endpoint = `/api/alumni/${id}`;
      } else if (type === 'faculty') {
        endpoint = `/api/faculty/${id}`;
      }
      await apiService.raw.delete(endpoint);
      // Refetch data after deletion
      const [studentsRes, alumniRes, facultyRes] = await Promise.all([
        apiService.raw.get('/api/student/getall'),
        apiService.raw.get('/api/alumni/getall'),
        apiService.raw.get('/api/faculty/getall'),
      ]);
      setStudents(studentsRes.data.data.students || []);
      setAlumni(alumniRes.data.data.alumni || []);
      setFaculty(facultyRes.data.data.faculty || []);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = (id, type, updatedData) => {
    // This function would typically take updatedData and modify the state.
    // For now, it's just a placeholder to trigger the confirmation.
    console.log(`Update user ID: ${id} of type ${type} with data:`, updatedData);
    // In a real app, you'd integrate with a backend API here.
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10 text-gray-500">Loading data...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 mt-2">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <ProfileCard isProfileComplete={user?.name && user?.email && user?.phone} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Metric Cards */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Logins</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">1,245</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">876</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <BellRing className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mentorship Matches</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">432</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <BarChart2 className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

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
      case 'students':
        return (
          <UserTableDisplay
            userType="students"
            users={students}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'alumni':
        return (
          <UserTableDisplay
            userType="alumni"
            users={alumni}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'faculty':
        return (
          <UserTableDisplay
            userType="faculty"
            users={faculty}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      case 'settings':
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <p className="text-gray-700">Settings content will go here.</p>
            </div>
        );
      case 'help':
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
                <p className="text-gray-700">Help content will go here.</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-inter">
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        <Sidebar onNavigate={setActiveView} /> {/* Pass navigation handler to Sidebar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Main App Component ---
// This is the entry point of the React application.
export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}
