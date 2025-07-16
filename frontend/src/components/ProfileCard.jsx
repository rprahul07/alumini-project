import React from 'react';
import { FiEdit2, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileCard = ({ compact = false }) => {
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
      <div className={`bg-white rounded-2xl shadow-lg ${compact ? 'p-4 max-w-xs my-2' : 'p-8 max-w-sm my-10'} mx-auto animate-pulse`}>
        <div className="flex flex-col items-center space-y-2">
          <div className={compact ? 'w-14 h-14 bg-gray-200 rounded-full' : 'w-24 h-24 bg-gray-200 rounded-full'} />
          <div className={compact ? 'h-5 bg-gray-200 rounded w-20' : 'h-6 bg-gray-200 rounded w-32'} />
          <div className={compact ? 'h-3 bg-gray-200 rounded w-16' : 'h-4 bg-gray-200 rounded w-20'} />
          <div className={compact ? 'h-3 bg-gray-200 rounded w-18' : 'h-4 bg-gray-200 rounded w-24'} />
          <div className={compact ? 'h-8 bg-gray-200 rounded w-20 mt-2' : 'h-10 bg-gray-200 rounded w-32 mt-4'} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg ${compact ? 'p-4 max-w-xs my-2' : 'p-8 max-w-sm my-10'} text-center mx-auto`}>
        <p className="text-gray-600">Could not load profile. Please log in again.</p>
      </div>
    );
  }

  const twoFields = getTwoFields();

  return (
    <div className={`bg-white shadow-md rounded-2xl min-h-[165px] min-w-xl ${compact ? 'px-5 max-w-xl my-2' : 'px-5 max-w-xl my-6'} flex items-center `}>
      <div className="relative group">
      <img
        src={user.photoUrl || 'https://via.placeholder.com/150/EEEEEE/888888?text=No+Photo'}
        alt={user.fullName || 'User'}
        className={compact ? 'w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow mb-2 gap-4' : 'w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow mb-3'}
      />
      <div className="absolute bottom-0 right-0 flex gap-1">
        <button
        onClick={() => navigate('/profile/edit')}
        className={`bg-indigo-600 text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors transform hover:scale-105 border-2 border-white`}
      >
        <FiEdit2 className="h-4 w-4" />
      </button>
       </div>
       </div>
      
      <div className="flex flex-col m-5 w-half pl-2">
        <div className='flex flex-rows'>
      <h2 className={compact ? 'text-lg font-bold text-gray-900 text-center mb-1' : 'text-2xl font-bold text-gray-900 text-center mb-1'}>{user.fullName || 'User'}</h2>
       <span className={`ml-2 mt-1 px-3 py-1 rounded-full ${compact ? 'text-xs mb-2' : 'text-sm font-semibold mb-3'} ${
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
      </div>
      <div className='flex flex-col items-start'>
      <div className={`w-full flex flex-col  ${compact ? 'mb-2' : 'mb-3'}`}>
        {twoFields.map((field, idx) => (
          <div key={idx} className={compact ? 'text-base text-gray-700 text-left' : 'text-sm text-gray-700 text-center'}>
            <span className="font-medium">{field.label}:</span> {field.value || 'N/A'}
          </div>
        ))}
      </div>
      {(user.linkedinUrl || user.twitterUrl || user.githubUrl) && (
        <div className={`flex space-x-2 ${compact ? 'mb-2' : 'mb-5'}`}>
          {user.linkedinUrl && (
            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FiLinkedin className="h-5 w-5 text-gray-400 hover:text-indigo-800" />
            </a>
          )}
          {user.twitterUrl && (
            <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FiTwitter className="h-5 w-5 text-gray-400 hover:text-blue-700" />
            </a>
          )}
          {user.githubUrl && (
            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
              <FiGithub className="h-5 w-5 text-gray-400 hover:text-gray-900" />
            </a>
          )}
        </div>
      )}
      </div>
      </div>
      </div>
  );
};

export default ProfileCard; 