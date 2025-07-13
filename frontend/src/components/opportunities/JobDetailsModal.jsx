import React, { useState, useEffect } from 'react';
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

const JobDetailsModal = ({ job, open, onClose, onJobEdit, onJobDelete, showAlert }) => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!open || !job) return null;

  // Permissions: creator or admin can edit/delete
  const canEditDelete = user && (user.role === 'admin' || user.id === job.userId);

  // Format date
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide p-4" style={{ scrollbarWidth: 'none' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Job Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Job Overview Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight">
                {job.jobTitle}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                ${job.type === 'internship' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {job.type === 'internship' ? 'Internship' : 'Job'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">{job.companyName}</span>
              </div>
              
              {job.deadline && (
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
              )}
              {/* Location/Remote */}
              {job.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-1">Location:</span>
                  <span>{job.location === 'Remote' ? 'Remote' : job.location}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatPostedDate(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Creator Information Section */}
          {job.user && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
              <div className="flex items-center mb-2">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Posted by</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium text-gray-900">{job.user.fullName}</span>
                </div>
                
                {job.user.alumni && (
                  <div className="flex items-center text-sm text-gray-600">
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

          {/* Application Details Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-green-600" />
              <h4 className="font-semibold text-gray-900">Application Details</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-900">
                  Registration Type: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold
                    ${job.registrationType === 'external' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {job.registrationType === 'external' ? 'External Link' : 'Internal Application'}
                  </span>
                </span>
              </div>
              
              {job.registrationType === 'external' && job.registrationLink && (
                <div className="flex items-center text-sm text-gray-600">
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

          {/* Job Description Section */}
          {job.description && (
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {canEditDelete && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal using CreateJobModal */}
      {showEditModal && (
        <CreateJobModal
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onJobEdit && onJobEdit();
          }}
          showAlert={showAlert}
          editMode={true}
          jobToEdit={job}
        />
      )}
      {/* Delete Confirmation Modal (to be implemented) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-red-700 mb-4 text-center">Delete Job?</h2>
            <p className="text-gray-700 mb-4 text-center">Are you sure you want to delete this job? This action cannot be undone.</p>
            <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
              <button
                className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full px-4 py-1.5 font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                onClick={async () => {
                  try {
                    await axios.delete(`/api/job/${job.id}`);
                    setShowDeleteModal(false);
                    onJobDelete && onJobDelete();
                  } catch (err) {
                    alert('Failed to delete job.');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



export default JobDetailsModal; 