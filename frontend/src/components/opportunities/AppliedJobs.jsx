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
        <div className="h-full overflow-x-auto rounded-xl shadow bg-white">
          <table className="w-full table-fixed divide-y divide-gray-200 text-xs h-full" role="grid" aria-label="Applied jobs table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-2 py-2 w-32 text-left font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appliedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-2 py-2 whitespace-nowrap font-semibold">
                    <span className="truncate max-w-[120px] block">{job.jobTitle || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className="truncate max-w-[100px] block">{job.companyName || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                    <button
                      className="px-2 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
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