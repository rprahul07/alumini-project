import React, { useState, useEffect } from 'react';
import { FiEdit2, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Fetch profile data from API based on user role
          const response = await axios.get(`/api/student/profile/get/`, {
            withCredentials: true
          });
          
          console.log('Profile data:', response.data);
          if (response.data.success) {
            setProfile(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'student':
        return 'Student';
      case 'faculty':
        return 'Faculty';
      case 'alumni':
        return 'Alumni';
      default:
        return 'User';
    }
  };

  const getRoleSpecificInfo = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'student':
        return (
          <>
            <div className="text-sm text-gray-500">Roll Number: {profile.student?.rollNumber || 'N/A'}</div>
            <div className="text-sm text-gray-500">Department: {profile.department || 'N/A'}</div>
            <div className="text-sm text-gray-500">Current Semester: {profile.student?.currentSemester || 'N/A'}</div>
            {profile.student?.graduationYear && (
              <div className="text-sm text-gray-500">Graduation Year: {profile.student.graduationYear}</div>
            )}
          </>
        );
      case 'faculty':
        return (
          <>
            <div className="text-sm text-gray-500">Department: {profile.department || 'N/A'}</div>
            <div className="text-sm text-gray-500">Designation: {profile.faculty?.designation || 'N/A'}</div>
          </>
        );
      case 'alumni':
        return (
          <>
            <div className="text-sm text-gray-500">Department: {profile.department || 'N/A'}</div>
            <div className="text-sm text-gray-500">Graduation Year: {profile.alumni?.graduationYear || 'N/A'}</div>
            <div className="text-sm text-gray-500">Current Job: {profile.alumni?.currentJobTitle || 'N/A'}</div>
            <div className="text-sm text-gray-500">Company: {profile.alumni?.companyName || 'N/A'}</div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-4">
        <img
          src={profile?.photoUrl || '/default-avatar.png'}
          alt={profile?.fullName || 'User'}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{profile?.fullName || 'User'}</h2>
          <p className="text-sm text-gray-500">{getRoleDisplay(profile?.role)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {getRoleSpecificInfo()}
        <div className="text-sm text-gray-500">Email: {profile?.email || 'N/A'}</div>
        <div className="text-sm text-gray-500">Phone: {profile?.phoneNumber || 'N/A'}</div>
        {profile?.bio && (
          <div className="text-sm text-gray-500">Bio: {profile.bio}</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-3">
          {profile?.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <FiLinkedin className="h-5 w-5" />
            </a>
          )}
          {profile?.twitterUrl && (
            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <FiTwitter className="h-5 w-5" />
            </a>
          )}
          {profile?.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <FiGithub className="h-5 w-5" />
            </a>
          )}
        </div>
        <button 
          onClick={() => navigate('/profile/edit')}
          className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          <FiEdit2 className="h-4 w-4 mr-1" />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
