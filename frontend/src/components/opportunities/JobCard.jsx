import React, { memo, useCallback } from 'react';
import { CalendarIcon, BuildingOffice2Icon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog';
import axios from '../../config/axios';

const JobCard = memo(({ job, user, isApplied, onClick, onApply, onJobDeleted }) => {
  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Format posted date
  const formatPostedDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    if (diffDays <= 7) return `Posted ${diffDays - 1} days ago`;
    return `Posted ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, []);

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
      className="group bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200 hover:border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 flex flex-col h-full relative"
      onClick={onClick}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 via-transparent to-secondary-100/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Job Type Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm border font-sans bg-white inline-flex items-center gap-1.5
            ${job.type === 'internship'
              ? 'text-green-700 border-green-200'
              : 'text-primary-700 border-primary-200'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${job.type === 'internship' ? 'bg-green-500' : 'bg-primary-500'}`}></span>
          {job.type === 'internship' ? 'Internship' : 'Job'}
        </span>
      </div>

      {/* Job Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        {/* Job Title */}
        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-base leading-tight group-hover:text-primary-600 transition-colors duration-300 font-sans">
          {job.jobTitle}
        </h3>

        {/* Job Details */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center text-xs text-slate-600">
            <CalendarIcon className="h-3 w-3 mr-2 text-primary-500 flex-shrink-0" />
            <span className="font-medium text-slate-500">Deadline:</span>
            <span className="ml-2 text-slate-900 font-sans">{formatDate(job.deadline)}</span>
          </div>
          <div className="flex items-center text-xs text-slate-600">
            <BuildingOffice2Icon className="h-3 w-3 mr-2 text-secondary-500 flex-shrink-0" />
            <span className="text-slate-900 font-medium font-sans">{job.companyName}</span>
          </div>
          {/* Location/Remote */}
          {job.location && (
            <div className="flex items-center text-xs text-slate-600">
              <svg className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-slate-500">Location:</span>
              <span className="ml-2 text-slate-900 font-sans">{job.location === 'Remote' ? 'Remote' : job.location}</span>
            </div>
          )}
        </div>

        {/* Creator Information */}
        {job.user && (
          <div className="border-t border-slate-200 pt-3 mb-3">
            <div className="flex items-center text-xs text-slate-600 mb-2">
              <UserIcon className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium text-slate-900 font-sans">{job.user.fullName}</span>
            </div>
            {job.user.alumni && (
              <div className="text-xs text-slate-500 ml-5 mb-1 font-sans">
                {job.user.alumni.currentJobTitle} at {job.user.alumni.companyName}
              </div>
            )}
            <div className="flex items-center text-xs text-slate-400 ml-5 font-sans">
              <ClockIcon className="h-3 w-3 mr-1.5" />
              {formatPostedDate(job.createdAt)}
            </div>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Apply Button */}
        <button
          className={`mt-3 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-sans ${buttonState.disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
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
});

export default JobCard; 