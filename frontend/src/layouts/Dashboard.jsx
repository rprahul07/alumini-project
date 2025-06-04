import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import useAlert from '../hooks/useAlert';
import { profileAPI } from '../middleware/api';

function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showAlert } = useAlert();
  const userRole = localStorage.getItem('userRole');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile data...');
      const response = await profileAPI.getProfile();
      console.log('Profile response:', response);
      
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert(error.message || 'Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to logout...');
      await logout();
      showAlert('Logged out successfully!', 'success');
      console.log('Logout successful, navigating to role selection...');
      navigate('/role-selection', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      showAlert(error.message || 'Failed to logout. Please try again.', 'error');
    }
  };

  const renderProfileInfo = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="text-gray-600 text-center py-8">
          <p>No profile data available.</p>
          <button
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Retry Loading
          </button>
        </div>
      );
    }

    const profileFields = {
      fullName: { icon: FiUser, label: 'Full Name' },
      email: { icon: FiMail, label: 'Email' },
      phoneNumber: { icon: FiPhone, label: 'Phone' },
      department: { icon: FiBook, label: 'Department' },
    };

    // Role-specific fields
    if (userRole === 'student') {
      Object.assign(profileFields, {
        currentSemester: { icon: FiBook, label: 'Current Semester' },
        rollNumber: { icon: FiUser, label: 'Roll Number' },
      });
    } else if (userRole === 'alumni') {
      Object.assign(profileFields, {
        graduationYear: { icon: FiBook, label: 'Graduation Year' },
        currentJobTitle: { icon: FiUser, label: 'Current Job' },
        companyName: { icon: FiBook, label: 'Company' },
      });
    } else if (userRole === 'faculty') {
      Object.assign(profileFields, {
        designation: { icon: FiUser, label: 'Designation' },
      });
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(profileFields).map(([key, { icon: Icon, label }]) => (
          profileData[key] && (
            <div key={key} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Icon className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="font-medium">{profileData[key]}</div>
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-white text-xl font-semibold">
                Alumni Portal
              </div>
              <div className="ml-4 text-white text-sm">
                {userRole && `Logged in as ${userRole}`}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white hover:bg-primary/80 rounded-md transition-colors"
              title="Logout"
            >
              <FiLogOut className="mr-2" size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">
            Welcome, {profileData?.fullName || userRole}!
          </h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              {renderProfileInfo()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 