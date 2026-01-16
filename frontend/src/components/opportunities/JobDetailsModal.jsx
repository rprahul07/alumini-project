import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  XMarkIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  UserIcon,
  ClockIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import ApplyJobModal from './ApplyJobModal';
import CreateJobModal from './CreateJobModal';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const JobDetailsModal = ({ job, open, onClose, onJobEdit, onJobDelete, showAlert }) => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!open || !job) return null;

  const canEditDelete = user && (user.role === 'admin' || user.id === job.userId);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  return ReactDOM.createPortal(
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide p-4 sm:p-5 lg:p-6 border border-slate-200 shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 font-sans">Job Details</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors p-1 sm:p-2 rounded-full hover:bg-slate-100">
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Job Overview */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 lg:p-5 mb-3 sm:mb-4 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg leading-tight font-sans">
                {job.jobTitle}
              </h3>
              <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border font-sans ${job.type === 'internship'
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-400/30'
                  : 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border-primary-400/30'
                }`}>
                {job.type === 'internship' ? 'Internship' : 'Job'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center text-slate-700">
                <BuildingOffice2Icon className="h-4 w-4 mr-2 text-secondary-500 flex-shrink-0" />
                <span className="font-semibold text-slate-900 font-sans">{job.companyName}</span>
              </div>

              {job.deadline && (
                <div className="flex items-center text-slate-700">
                  <CalendarIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" />
                  <span className="font-medium text-slate-600">Deadline:</span>
                  <span className="ml-2 text-slate-900 font-sans">{formatDate(job.deadline)}</span>
                </div>
              )}

              {job.location && (
                <div className="flex items-center text-slate-700">
                  <svg className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-slate-600">Location:</span>
                  <span className="ml-2 text-slate-900 font-sans">{job.location === 'Remote' ? 'Remote' : job.location}</span>
                </div>
              )}

              <div className="flex items-center text-slate-700">
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-slate-500 font-sans">{formatPostedDate(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          {job.user && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 mb-4 border border-slate-200">
              <div className="flex items-center mb-3">
                <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
                <h4 className="font-semibold text-slate-900 text-base font-sans">Posted by</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 text-base font-sans">{job.user.fullName}</span>
                </div>

                {job.user.alumni && (
                  <div className="flex items-center text-slate-700">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-900 font-sans">{job.user.alumni.currentJobTitle} at {job.user.alumni.companyName}</span>
                  </div>
                )}

                {job.user.department && (
                  <div className="text-xs text-slate-600 ml-6 font-sans">
                    Department: {job.user.department}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Details */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 mb-4 border border-slate-200">
            <div className="flex items-center mb-3">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-green-500" />
              <h4 className="font-semibold text-slate-900 text-base font-sans">Application Details</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <span className="font-medium text-slate-900 font-sans">
                  Registration Type:
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border font-sans ${job.registrationType === 'external'
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-500 border-orange-400/30'
                      : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-500 border-blue-400/30'
                    }`}>
                    {job.registrationType === 'external' ? 'External Link' : 'Internal Application'}
                  </span>
                </span>
              </div>

              {job.registrationType === 'external' && job.registrationLink && (
                <div className="flex items-center text-slate-700">
                  <LinkIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                  <a
                    href={job.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 underline font-medium font-sans"
                  >
                    Apply on External Site
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          {job.description && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 mb-4 border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-base mb-3 font-sans">Job Description</h4>
              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {job.description}
              </p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 font-semibold bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl font-sans text-xs sm:text-sm"
            >
              Close
            </button>

            {canEditDelete && (
              <div className="flex items-center gap-2 sm:gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-xl border border-primary-400/30 text-primary-600 hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl font-sans text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 font-semibold bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 text-red-600 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl font-sans text-xs sm:text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && ReactDOM.createPortal(
        <CreateJobModal
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onJobEdit && onJobEdit();
          }}
          showAlert={showAlert}
          editMode={true}
          jobToEdit={job}
        />, document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative border border-slate-200">
            <button
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100/40 to-pink-100/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-3 font-sans">Delete Job?</h2>
              <p className="text-slate-600 text-xs font-sans">Are you sure you want to delete this job? This action cannot be undone.</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 font-semibold font-sans bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 font-semibold font-sans bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
                onClick={async () => {
                  try {
                    await axios.delete(`/api/job/${job.id}`);
                    toast.success('Job deleted successfully!');
                    setShowDeleteModal(false);
                    onJobDelete && onJobDelete();
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to delete job.');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </>,
    document.body
  );
};

export default JobDetailsModal;
