import React from 'react';
import { FiEdit2, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OptimizedImage from './OptimizedImage';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ${compact ? 'p-4 max-w-xs my-2' : 'p-8 max-w-sm my-10'} mx-auto animate-pulse`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className={compact ? 'w-14 h-14 bg-white/20 rounded-full' : 'w-24 h-24 bg-white/20 rounded-full'} />
          <div className={compact ? 'h-5 bg-white/20 rounded w-20' : 'h-6 bg-white/20 rounded w-32'} />
          <div className={compact ? 'h-3 bg-white/20 rounded w-16' : 'h-4 bg-white/20 rounded w-20'} />
          <div className={compact ? 'h-3 bg-white/20 rounded w-18' : 'h-4 bg-white/20 rounded w-24'} />
          <div className={compact ? 'h-8 bg-white/20 rounded w-20 mt-2' : 'h-10 bg-white/20 rounded w-32 mt-4'} />
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 max-w-xs my-6 text-center mx-auto`}
      >
        <p className="text-gray-300">Could not load profile. Please log in again.</p>
      </motion.div>
    );
  }

  const twoFields = getTwoFields();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 max-w-xs w-full flex flex-col items-center mx-auto"
    >
      {/* Photo with edit button */}
      <div className="relative">
        <div className="relative w-24 h-24 mb-3">
          {user.photoUrl ? (
            <OptimizedImage
              src={user.photoUrl}
              alt={user.fullName || 'User'}
              wrapperClassName="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 shadow-lg"
              className="w-full h-full object-cover"
              sizes="96px"
              loading="eager"
            />
          ) : (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 shadow-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="absolute bottom-1 right-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 border-2 border-white transform hover:scale-105"
          title="Edit Profile"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
      </div>
      {/* Name */}
      <h2 className="text-xl font-bold text-white mt-1 mb-1 text-center">{user.fullName || 'User'}</h2>
      {/* Role badge */}
      <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 text-center border ${
        user.role?.toLowerCase() === 'alumni'
          ? 'bg-green-500/20 text-green-300 border-green-500/30'
          : user.role?.toLowerCase() === 'student'
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
          : user.role?.toLowerCase() === 'faculty'
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
          : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      }`}>
        {getRoleDisplay(user.role)}
      </span>
      {/* Details */}
      <div className="flex flex-col items-center w-full mb-2">
        {twoFields.map((field, idx) => (
          <div key={idx} className="text-sm text-gray-300 mb-1 text-center">
            <span className="font-medium">{field.label}:</span> {field.value || 'N/A'}
          </div>
        ))}
      </div>
      {/* Social Icons */}
      {(user.linkedinUrl || user.twitterUrl || user.githubUrl) && (
        <div className="flex space-x-2 mt-3 justify-center">
          {user.linkedinUrl && (
            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <FiLinkedin className="h-5 w-5 text-gray-400 hover:text-primary-400 transition-colors transform hover:scale-110" />
            </a>
          )}
          {user.twitterUrl && (
            <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">
              <FiTwitter className="h-5 w-5 text-gray-400 hover:text-primary-400 transition-colors transform hover:scale-110" />
            </a>
          )}
          {user.githubUrl && (
            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
              <FiGithub className="h-5 w-5 text-gray-400 hover:text-primary-400 transition-colors transform hover:scale-110" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCard; 