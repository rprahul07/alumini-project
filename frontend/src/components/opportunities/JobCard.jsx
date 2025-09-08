import React from 'react';
import { CalendarIcon, BuildingOffice2Icon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog';
import axios from '../../config/axios';

const JobCard = ({ job, user, isApplied, onClick, onApply, onJobDeleted }) => {
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
        className: "mt-2 px-4 py-1.5 bg-primary text-white rounded-full font-semibold shadow hover:bg-primary-700 transition",
        disabled: false
      };
    }
  };

  const buttonState = getButtonState();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState(false);

  // Admin delete handler
  const handleDeleteJob = () => {
    setConfirmMessage('Are you sure you want to delete this job? This action cannot be undone.');
    setConfirmAction(() => handleDeleteJobConfirmed);
    setConfirmOpen(true);
  };

  const handleDeleteJobConfirmed = async () => {
    setActionLoading(true);
    try {
      const response = await axios.delete(`/api/job/${job.id}`);
      if (response.data.success !== false) {
        toast.success('Job deleted successfully!');
        if (onJobDeleted) onJobDeleted(job.id);
      } else {
        toast.error(response.data.message || 'Failed to delete job.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete job.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 flex flex-col h-full relative"
      onClick={onClick}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Job Type Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border
            ${job.type === 'internship' 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-400/30' 
              : 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border-primary-400/30'
            }`}
        >
          {job.type === 'internship' ? 'Internship' : 'Job'}
        </span>
      </div>

      {/* Job Content */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        {/* Job Title */}
        <h3 className="font-bold text-white mb-3 line-clamp-2 text-xl leading-tight group-hover:text-primary-400 transition-colors duration-300">
          {job.jobTitle}
        </h3>
        
        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-300">
            <CalendarIcon className="h-4 w-4 mr-3 text-primary-400 flex-shrink-0" />
            <span className="font-medium text-gray-400">Deadline:</span>
            <span className="ml-2 text-white">{formatDate(job.deadline)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <BuildingOffice2Icon className="h-4 w-4 mr-3 text-secondary-400 flex-shrink-0" />
            <span className="text-white font-medium">{job.companyName}</span>
          </div>
          {/* Location/Remote */}
          {job.location && (
            <div className="flex items-center text-sm text-gray-300">
              <svg className="h-4 w-4 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-gray-400">Location:</span>
              <span className="ml-2 text-white">{job.location === 'Remote' ? 'Remote' : job.location}</span>
            </div>
          )}
        </div>
        
        {/* Creator Information */}
        {job.user && (
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="flex items-center text-sm text-gray-300 mb-2">
              <UserIcon className="h-4 w-4 mr-3 text-blue-400 flex-shrink-0" />
              <span className="font-medium text-white">{job.user.fullName}</span>
            </div>
            {job.user.alumni && (
              <div className="text-sm text-gray-400 ml-7 mb-1">
                {job.user.alumni.currentJobTitle} at {job.user.alumni.companyName}
              </div>
            )}
            <div className="flex items-center text-xs text-gray-500 ml-7">
              <ClockIcon className="h-3 w-3 mr-2" />
              {formatPostedDate(job.createdAt)}
            </div>
          </div>
        )}
        
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        
        {/* Apply Button */}
        <button
          className={`mt-4 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
            buttonState.disabled
              ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30'
              : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl'
          }`}
          onClick={e => { if (!buttonState.disabled) { e.stopPropagation(); onApply && onApply(job); } }}
          disabled={buttonState.disabled}
        >
          {buttonState.text}
        </button>
      </div>
      
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Job"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default JobCard; 