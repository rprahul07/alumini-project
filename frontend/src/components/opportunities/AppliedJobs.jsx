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
        const res = await axios.get('/api/job/selfapplied/get');
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600">Job Title</th>
                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600">Company</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {appliedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{job.jobTitle || '-'}</td>
                  <td className="py-2 px-4 border-b">{job.companyName || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-3 py-1 rounded bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                      onClick={() => handleView(job)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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