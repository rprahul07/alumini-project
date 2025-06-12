import React, { useState, useEffect } from 'react';
import { FiEdit2, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) throw new Error('User not logged in.');

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const getEndpoint = `/api/${parsedUser.role}/profile/get/`;
        const response = await axios.get(getEndpoint, { withCredentials: true });

        if (response.data.success) {
          setProfile(response.data.data || {});
        } else {
          setError(response.data.message || 'Failed to fetch profile data.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Network error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'faculty': return 'Faculty';
      case 'alumni': return 'Alumni';
      default: return 'User';
    }
  };

  const getRoleSpecificInfo = () => {
    if (!profile || !profile.role) return null;

    switch (profile.role) {
      case 'student':
        return (
          <>
            <Info label="Roll Number" value={profile.student?.rollNumber} />
            <Info label="Department" value={profile.department} />
            <Info label="Current Semester" value={profile.student?.currentSemester} />
            {profile.student?.graduationYear && (
              <Info label="Expected Graduation" value={profile.student.graduationYear} />
            )}
            {(profile.student?.batch?.startYear && profile.student?.batch?.endYear) && (
              <Info label="Batch" value={`${profile.student.batch.startYear} - ${profile.student.batch.endYear}`} />
            )}
          </>
        );
      case 'faculty':
        return (
          <>
            <Info label="Department" value={profile.department} />
            <Info label="Designation" value={profile.faculty?.designation} />
          </>
        );
      case 'alumni':
        return (
          <>
            <Info label="Department" value={profile.department} />
            <Info label="Graduation Year" value={profile.alumni?.graduationYear} />
            <Info label="Course" value={profile.alumni?.course} />
            <Info label="Current Job" value={profile.alumni?.currentJobTitle} />
            <Info label="Company" value={profile.alumni?.companyName} />
          </>
        );
      default:
        return null;
    }
  };

  const Info = ({ label, value }) => (
    <div className="text-sm text-gray-700">
      {label}: <span className="font-medium">{value || 'N/A'}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto my-8 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-md mx-auto my-8">
        <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto my-10 border border-gray-100">
      <div className="flex items-center justify-start mb-6 space-x-6">
        <img
          src={profile.photoUrl || 'https://via.placeholder.com/150/EEEEEE/888888?text=No+Photo'}
          alt={profile.fullName || 'User'}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{profile.fullName || 'User'}</h2>
          <p className="text-lg text-indigo-700 font-semibold">{getRoleDisplay(profile.role)}</p>

          {/* Small Edit Button below role */}
          <button
            onClick={() => navigate('/profile/edit')}
            className="mt-2 inline-flex items-center space-x-1 text-xs px-2 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 shadow"
          >
            <FiEdit2 className="h-3 w-3" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <hr className="my-6 border-t border-gray-200" />

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
        <Info label="Email" value={profile.email} />
        <Info label="Phone" value={profile.phoneNumber} />
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">General Information</h3>
        <Info label="Department" value={profile.department} />
        {profile.bio && (
          <div className="text-md mt-2">
            <span className="font-medium block text-gray-600 mb-1">Bio:</span>
            <p className="ml-2 text-justify italic">{profile.bio}</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Role-Specific Details</h3>
        <div className="space-y-2">{getRoleSpecificInfo()}</div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Social Media</h3>
        <div className="flex space-x-5 justify-center md:justify-start">
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FiLinkedin className="h-6 w-6 text-indigo-600 hover:text-indigo-800" />
            </a>
          )}
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FiTwitter className="h-6 w-6 text-blue-500 hover:text-blue-700" />
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
              <FiGithub className="h-6 w-6 text-gray-800 hover:text-gray-900" />
            </a>
          )}
          {!profile.linkedinUrl && !profile.twitterUrl && !profile.githubUrl && (
            <p className="text-gray-500 text-sm">No social links provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
