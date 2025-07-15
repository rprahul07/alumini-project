import React, { useEffect, useState } from 'react';
import JobDetailsModal from './JobDetailsModal';
import axios from '../../config/axios';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch applied jobs from backend
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/job/applied');
        setAppliedJobs(res.data.data || []);
      } catch (err) {
        setError('Failed to load applied jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  const handleView = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Applied Jobs</h3>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : appliedJobs.length === 0 ? (
        <div className="text-center text-gray-400">You have not applied to any jobs yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {appliedJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate text-base">{job.jobTitle || '-'}</div>
                <div className="text-sm text-gray-700 truncate">{job.companyName || '-'}</div>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={() => handleView(job)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <JobDetailsModal
        job={selectedJob}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default AppliedJobs; 