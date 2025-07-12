import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import ApplyJobModal from './ApplyJobModal';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';

const JobDetailsModal = ({ job, open, onClose, onJobEdit, onJobDelete }) => {
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Job Details</h2>
          <button
            onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Job Status */}
          <div className="mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}</span>
          </div>
          {/* Job Title */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">{job.jobTitle}</h3>
          {/* Job Details */}
          <div className="space-y-1 mb-2">
            {job.deadline && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                {formatDate(job.deadline)}
              </div>
            )}
            {job.companyName && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-400" />
                {job.companyName}
              </div>
            )}
            {job.location && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <span className="h-4 w-4 mr-2 text-gray-400">📍</span>
                {job.location}
              </div>
            )}
            {job.salary && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <span className="h-4 w-4 mr-2 text-gray-400">💰</span>
                {job.salary}
              </div>
            )}
          </div>
          {/* Job Description */}
          {job.description && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Description</h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {job.description}
              </p>
            </div>
          )}
          {/* Other fields (requirements, etc.) */}
          {job.requirements && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Requirements</h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}
          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            {canEditDelete && (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-full px-4 py-1.5 font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* Edit Modal (to be implemented) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Edit Job</h2>
            {/* Simple edit form */}
            <EditJobForm job={job} onSuccess={() => { setShowEditModal(false); onJobEdit && onJobEdit(); }} />
          </div>
        </div>
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
            <div className="flex gap-2 justify-center">
              <button
                className="rounded-full px-4 py-1.5 font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
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

// Simple EditJobForm component (beginner-friendly, inline for now)
function EditJobForm({ job, onSuccess }) {
  const [form, setForm] = useState({
    jobTitle: job.jobTitle || '',
    companyName: job.companyName || '',
    description: job.description || '',
    deadline: job.deadline ? job.deadline.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/job/${job.id}`, form);
      onSuccess && onSuccess();
    } catch (err) {
      setError('Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">Job Title
        <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
      </label>
      <label className="text-sm font-semibold text-gray-700">Company Name
        <input name="companyName" value={form.companyName} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
      </label>
      <label className="text-sm font-semibold text-gray-700">Description
        <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" rows={3} required />
      </label>
      <label className="text-sm font-semibold text-gray-700">Deadline
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" />
      </label>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

export default JobDetailsModal; 