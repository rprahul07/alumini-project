import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import CreateJobModal from './CreateJobModal';

const MyCreatedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/job/alumni/created');
        setJobs(res.data.data || []);
      } catch (err) {
        setError('Failed to load your jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    setEditJob(job);
    setShowEditModal(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeletingId(jobId);
    try {
      await axios.delete(`/api/job/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      alert('Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditJob(null);
    // Refresh jobs list
    axios.get('/api/job/alumni/created').then(res => setJobs(res.data.data || []));
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">My Created Jobs</h3>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-400">You have not created any jobs yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600">Job Title</th>
                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600">Company</th>
                <th className="py-2 px-4 border-b text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{job.jobTitle || '-'}</td>
                  <td className="py-2 px-4 border-b">{job.companyName || '-'}</td>
                  <td className="py-2 px-4 border-b capitalize">{job.status || '-'}</td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                    >
                      {deletingId === job.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showEditModal && editJob && (
        <CreateJobModal
          onClose={() => { setShowEditModal(false); setEditJob(null); }}
          onSuccess={handleEditSuccess}
          editJob={editJob}
        />
      )}
    </div>
  );
};

export default MyCreatedJobs; 