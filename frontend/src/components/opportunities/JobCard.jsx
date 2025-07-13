import React from 'react';
import { CalendarIcon, BuildingOffice2Icon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

const JobCard = ({ job, user, isApplied, onClick, onApply }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format posted date
  const formatPostedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    if (diffDays <= 7) return `Posted ${diffDays - 1} days ago`;
    return `Posted ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Determine button state and styling
  const getButtonState = () => {
    // Check if current user is the creator of this job
    const isCreator = user && job.userId === user.id;
    const isAdmin = user && user.role === 'admin';
    if (isAdmin) {
      return {
        text: "Apply (Admins cannot apply)",
        className: "mt-2 px-4 py-1.5 bg-gray-300 text-gray-600 rounded-full font-semibold cursor-not-allowed",
        disabled: true
      };
    } else if (isCreator) {
      return {
        text: "You are the creator",
        className: "mt-2 px-4 py-1.5 bg-gray-300 text-gray-600 rounded-full font-semibold cursor-not-allowed",
        disabled: true
      };
    } else if (isApplied) {
      return {
        text: "Applied",
        className: "mt-2 px-4 py-1.5 bg-green-500 text-white rounded-full font-semibold cursor-not-allowed",
        disabled: true
      };
    } else {
      return {
        text: "Apply",
        className: "mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition",
        disabled: false
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col h-full w-full max-w-sm sm:max-w-md md:max-w-lg p-3 relative"
      onClick={onClick}
    >
      {/* Job Type Badge */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
          ${job.type === 'internship' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}
      >
        {job.type === 'internship' ? 'Internship' : 'Job'}
      </span>
      {/* Job Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Job Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-lg md:text-xl leading-tight">
          {job.jobTitle}
        </h3>
        {/* Job Details */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium text-gray-600">Deadline:</span>
            <span className="ml-1">{formatDate(job.deadline)}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-400" />
            {job.companyName}
          </div>
          {/* Location/Remote */}
          {job.location && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <span className="font-medium text-gray-600 mr-1">Location:</span>
              <span>{job.location === 'Remote' ? 'Remote' : job.location}</span>
            </div>
          )}
        </div>
        
        {/* Creator Information */}
        {job.user && (
          <div className="border-t border-gray-100 pt-2 mb-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-1">
              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium text-gray-700">{job.user.fullName}</span>
            </div>
            {job.user.alumni && (
              <div className="text-xs text-gray-500 ml-6">
                {job.user.alumni.currentJobTitle} at {job.user.alumni.companyName}
              </div>
            )}
            <div className="flex items-center text-xs text-gray-400 ml-6 mt-1">
              <ClockIcon className="h-3 w-3 mr-1" />
              {formatPostedDate(job.createdAt)}
            </div>
          </div>
        )}
        
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        {/* Apply Button */}
        <button
          className={buttonState.className}
          onClick={e => { if (!buttonState.disabled) { e.stopPropagation(); onApply && onApply(job); } }}
          disabled={buttonState.disabled}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
};

export default JobCard; 