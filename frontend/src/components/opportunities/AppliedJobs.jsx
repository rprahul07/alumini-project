import React, { useEffect, useState } from 'react';
import JobDetailsModal from './JobDetailsModal';
import axios from '../../config/axios';
import { motion } from 'framer-motion';

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
      <h3 className="text-sm font-semibold mb-3 text-slate-900">Applied Jobs</h3>
      {loading ? (
        <div className="text-center text-slate-600 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">{error}</div>
      ) : appliedJobs.length === 0 ? (
        <div className="text-center text-slate-600 py-8">You have not applied to any jobs yet.</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {appliedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-3 hover:bg-slate-200 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm mb-1 truncate">{job.jobTitle || '-'}</h4>
                      <p className="text-xs text-slate-600 truncate">{job.companyName || '-'}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                      onClick={() => handleView(job)}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block h-full overflow-x-auto rounded-xl shadow-2xl bg-slate-50 backdrop-blur-xl border border-slate-200"
          >
            <table className="w-full table-fixed divide-y divide-slate-200 text-xs h-full" role="grid" aria-label="Applied jobs table">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-2 py-2 w-48 text-left font-medium text-slate-700 uppercase tracking-wider">Job Title</th>
                  <th className="px-2 py-2 w-32 text-left font-medium text-slate-700 uppercase tracking-wider">Company</th>
                  <th className="px-2 py-2 w-40 text-right font-medium text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {appliedJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-2 py-2 whitespace-nowrap font-semibold">
                      <span className="truncate max-w-[120px] block text-slate-900">{job.jobTitle || '-'}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className="truncate max-w-[100px] block text-slate-600">{job.companyName || '-'}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                        onClick={() => handleView(job)}
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
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