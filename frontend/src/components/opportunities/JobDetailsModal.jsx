import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import ApplyJobModal from './ApplyJobModal';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';

const JobDetailsModal = ({ jobId, open, onClose, onApply }) => {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (!open || !jobId) return;
    setLoading(true);
    setError(null);
    setJob(null);
    axios.get(`/api/job/${jobId}`)
      .then(res => {
        if (res.data && res.data.success) {
          setJob(res.data.data);
        } else {
          setError('This job could not be found. It may have been removed.');
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setError('This job could not be found. It may have been removed.');
        } else {
          setError('Unable to load job details. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [open, jobId]);

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

  const handleApply = () => {
    if (job.registrationType === 'internal') {
      setShowApplyModal(true);
    } else if (onApply) {
      onApply();
    }
  };

  if (!open) return null;

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
          {/* Loading/Error/Content */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-10">
              <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
              <button
                onClick={onClose}
                className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          ) : job ? (
            <div className="p-2 sm:p-3">
              {/* Job Title */}
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
                {job.jobTitle}
              </h3>
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
              {/* Apply/Registration Button */}
              {job.registrationType === 'external' && job.registrationLink ? (
                <a
                  href={job.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                >
                  Go to Registration
                </a>
              ) : (
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                  onClick={handleApply}
                >
                  Apply
                </button>
              )}
              {/* Close Button */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={onClose}
                  className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {showApplyModal && job && job.registrationType === 'internal' && (
        <ApplyJobModal open={showApplyModal} onClose={() => setShowApplyModal(false)} job={job} />
      )}
    </>
  );
};

export default JobDetailsModal; 