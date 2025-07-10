import React, { useState } from 'react';
import ApplyJobModal from './ApplyJobModal';

const JobDetailsModal = ({ job, open, onClose, onApply }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  if (!open || !job) return null;

  const handleApply = () => {
    if (job.registrationType === 'internal') {
      setShowApplyModal(true);
    } else if (onApply) {
      onApply();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{job.jobTitle}</h2>
          <div className="text-lg text-gray-700 mb-1">{job.companyName}</div>
          <div className="text-sm text-gray-500 mb-2">Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</div>
          <div className="text-sm text-gray-500 mb-2">Type: {job.registrationType === 'external' ? 'External' : 'Internal'}</div>
          <div className="text-sm text-gray-500 mb-2">Status: {job.status}</div>
          <div className="mb-4 text-gray-700 whitespace-pre-line">{job.description}</div>
          {job.registrationType === 'external' ? (
            <a
              href={job.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Go to Registration
            </a>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
              onClick={handleApply}
            >
              Apply
            </button>
          )}
        </div>
      </div>
      {showApplyModal && job.registrationType === 'internal' && (
        <ApplyJobModal open={showApplyModal} onClose={() => setShowApplyModal(false)} job={job} />
      )}
    </>
  );
};

export default JobDetailsModal; 