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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide p-4">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Job Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Job Overview */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight">
                {job.jobTitle}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                job.type === 'internship' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {job.type === 'internship' ? 'Internship' : 'Job'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">{job.companyName}</span>
              </div>

              {job.deadline && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
              )}

              {job.location && (
                <div className="flex items-center">
                  <span className="font-medium mr-1">Location:</span>
                  <span>{job.location === 'Remote' ? 'Remote' : job.location}</span>
                </div>
              )}

              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatPostedDate(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          {job.user && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
              <div className="flex items-center mb-2">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Posted by</h4>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">{job.user.fullName}</span>
                </div>

                {job.user.alumni && (
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{job.user.alumni.currentJobTitle} at {job.user.alumni.companyName}</span>
                  </div>
                )}

                {job.user.department && (
                  <div className="text-xs text-gray-500">
                    Department: {job.user.department}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-green-600" />
              <h4 className="font-semibold text-gray-900">Application Details</h4>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-900">
                  Registration Type:
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    job.registrationType === 'external' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {job.registrationType === 'external' ? 'External Link' : 'Internal Application'}
                  </span>
                </span>
              </div>

              {job.registrationType === 'external' && job.registrationLink && (
                <div className="flex items-center text-gray-600">
                  <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={job.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Apply on External Site
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          {job.description && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 transition-all duration-200 shadow-sm"
            >
              Close
            </button>

            {canEditDelete && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 hover:from-red-100 hover:to-pink-100 transition-all duration-200 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Job?</h2>
              <p className="text-gray-600 text-sm">Are you sure you want to delete this job? This action cannot be undone.</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 text-gray-700 hover:from-gray-100 hover:to-slate-100 transition-all duration-200 shadow-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm"
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
