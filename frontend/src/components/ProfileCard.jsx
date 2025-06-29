import React from 'react';
import { FiEdit2, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileCard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplay = (role) => {
    const lowerRole = role?.toLowerCase();
    switch (lowerRole) {
      case 'student': return 'Student';
      case 'faculty': return 'Faculty';
      case 'alumni': return 'Alumni';
      default: return 'User';
    }
  };

  const getAlumniFields = () => {
    if (!user) return [];
    const fields = [];
    if (user.alumni?.currentJobTitle) fields.push({ label: 'Job Title', value: user.alumni.currentJobTitle });
    if (user.alumni?.companyName) fields.push({ label: 'Company', value: user.alumni.companyName });
    if (fields.length < 2 && user.alumni?.course) fields.push({ label: 'Course', value: user.alumni.course });
    return fields.slice(0, 3);
  };

  const getTwoFields = () => {
    if (!user) return [];
    const role = user.role?.toLowerCase();

    if (role === 'alumni') {
      return getAlumniFields();
    }
    if (role === 'student') {
      const fields = [];
      if (user.department) fields.push({ label: 'Department', value: user.department });
      if (user.student?.currentSemester) fields.push({ label: 'Semester', value: user.student.currentSemester });
      if (fields.length < 2 && user.student?.rollNumber) fields.push({ label: 'Roll Number', value: user.student.rollNumber });
      return fields.slice(0, 2);
    }
    if (role === 'faculty') {
      const fields = [];
      if (user.department) fields.push({ label: 'Department', value: user.department });
      if (user.faculty?.designation) fields.push({ label: 'Designation', value: user.faculty.designation });
      if (fields.length < 2 && user.email) fields.push({ label: 'Email', value: user.email });
      return fields.slice(0, 2);
    }
    // Generic fallback for any user type if role-specific fields fail
    const genericFields = [];
    if (user.department) genericFields.push({ label: 'Department', value: user.department });
    if (user.email) genericFields.push({ label: 'Email', value: user.email });
    return genericFields.slice(0,2);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm mx-auto my-10 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full" />
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-32 mt-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm mx-auto my-10">
        <p className="text-gray-600">Could not load profile. Please log in again.</p>
      </div>
    );
  }

  const twoFields = getTwoFields();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm mx-auto my-10 flex flex-col items-center border border-gray-100">
      <img
        src={user.photoUrl || 'https://via.placeholder.com/150/EEEEEE/888888?text=No+Photo'}
        alt={user.fullName || 'User'}
        className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">{user.fullName || 'User'}</h2>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
        user.role?.toLowerCase() === 'alumni'
          ? 'bg-green-100 text-green-700'
          : user.role?.toLowerCase() === 'student'
          ? 'bg-blue-100 text-blue-700'
          : user.role?.toLowerCase() === 'faculty'
          ? 'bg-purple-100 text-purple-700'
          : 'bg-gray-100 text-gray-700'
      }`}>
        {getRoleDisplay(user.role)}
      </span>
      <div className="w-full flex flex-col items-center gap-2 mb-4">
        {twoFields.map((field, idx) => (
          <div key={idx} className="text-sm text-gray-700 text-center">
            <span className="font-medium">{field.label}:</span> {field.value || 'N/A'}
          </div>
        ))}
      </div>
      {(user.linkedinUrl || user.twitterUrl || user.githubUrl) && (
        <div className="flex space-x-4 mb-4">
          {user.linkedinUrl && (
            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FiLinkedin className="h-5 w-5 text-indigo-600 hover:text-indigo-800" />
            </a>
          )}
          {user.twitterUrl && (
            <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FiTwitter className="h-5 w-5 text-blue-500 hover:text-blue-700" />
            </a>
          )}
          {user.githubUrl && (
            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
              <FiGithub className="h-5 w-5 text-gray-800 hover:text-gray-900" />
            </a>
          )}
        </div>
      )}
      <button
        onClick={() => navigate('/profile/edit')}
        className="mt-2 w-full flex items-center justify-center space-x-2 text-sm px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 shadow transition"
      >
        <FiEdit2 className="h-4 w-4" />
        <span>Edit Profile</span>
      </button>
    </div>
  );
};

export default ProfileCard; 