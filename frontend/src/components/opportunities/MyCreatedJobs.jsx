import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import JobDetailsModal from './JobDetailsModal';
import ApplicantDetailsModal from './ApplicantDetailsModal';
import { 
  XMarkIcon, 
  UserIcon, 
  EnvelopeIcon, 
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const MyCreatedJobs = ({ showAlert, refreshTrigger = 0 }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch jobs created by the alumni
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

  // Fetch applications for a job
  const handleViewApplications = async (jobId) => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    setShowApplicationsModal(true);
    setApplications([]);
    try {
      // Use new RESTful GET endpoint
      const res = await axios.get(`/api/job/${jobId}/applications`);
      setApplications(res.data.data || []);
    } catch (err) {
      setApplicationsError('Failed to load applications.');
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  // Refresh jobs after edit or delete
  const handleJobEdit = () => {
    fetchJobs();
    setShowModal(false);
    setSelectedJob(null);
  };
  const handleJobDelete = () => {
    fetchJobs();
    setShowModal(false);
    setSelectedJob(null);
  };



  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-white">My Created Jobs</h3>
      {loading ? (
        <div className="text-center text-gray-300">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-300">You have not created any jobs yet.</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-colors duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base mb-1 truncate">{job.jobTitle || '-'}</h3>
                    <p className="text-sm text-gray-300 truncate">{job.companyName || '-'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    job.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    job.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {job.status === 'approved' ? 'Approved' :
                     job.status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                    onClick={() => { setSelectedJob(job); setShowModal(true); }}
                  >
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
                    onClick={() => handleViewApplications(job.id)}
                  >
                    Applications
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
          className="hidden lg:block h-full overflow-x-auto rounded-xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20"
        >
          <table className="w-full table-fixed divide-y divide-white/20 text-xs h-full" role="grid" aria-label="My created jobs table">
            <thead className="bg-white/10">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-white/90 uppercase tracking-wider">Job Title</th>
                <th className="px-2 py-2 w-32 text-left font-medium text-white/90 uppercase tracking-wider">Company</th>
                <th className="px-2 py-2 w-24 text-left font-medium text-white/90 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-white/90 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/20">
          {jobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
                >
                  <td className="px-2 py-2 whitespace-nowrap font-semibold">
                    <span className="truncate max-w-[120px] block text-white">{job.jobTitle || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className="truncate max-w-[100px] block text-gray-300">{job.companyName || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    job.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    job.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                      {job.status === 'approved' ? 'Approved' :
                     job.status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                  </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                  onClick={() => { setSelectedJob(job); setShowModal(true); }}
                >
                  View
                </motion.button>
                <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
                  onClick={() => handleViewApplications(job.id)}
                >
                  Applications
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
        onClose={() => { setShowModal(false); setSelectedJob(null); }}
        onJobEdit={handleJobEdit}
        onJobDelete={handleJobDelete}
        showAlert={showAlert}
      />
      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide border border-white/20"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">Job Applications</h2>
                  <p className="text-sm text-gray-300 mt-1">
                    {selectedJob?.jobTitle} at {selectedJob?.companyName}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowApplicationsModal(false)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>
              {/* Application Count Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {applicationsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
                  <div className="text-gray-300 text-lg">Loading applications...</div>
                </div>
              ) : applicationsError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-400 text-lg font-semibold mb-4">{applicationsError}</div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewApplications(selectedJob?.id)}
                    className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                  >
                    Retry
                  </motion.button>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-gray-300 text-lg font-medium mb-2">No applications yet</div>
                  <div className="text-gray-400 text-sm text-center">
                    Applicants will appear here once they apply for this job
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((applicant, idx) => (
                    <motion.div 
                      key={applicant.id || idx} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Applicant Avatar */}
                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                            <UserIcon className="h-5 w-5 text-primary-400" />
                          </div>
                          
                          {/* Applicant Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{applicant.name || 'Unknown Applicant'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Role Badge */}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                applicant.role === 'alumni' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                applicant.role === 'student' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                'bg-gray-500/20 text-gray-300 border-gray-500/30'
                              }`}>
                                {applicant.role === 'alumni' ? 'Alumni' :
                                 applicant.role === 'student' ? 'Student' :
                                 applicant.role || 'Unknown'}
                              </span>
                              
                              {/* Current Role (if available) */}
                              {applicant.currentJobTitle && (
                                <span className="text-sm text-gray-300 truncate">
                                  • {applicant.currentJobTitle}
                                  {applicant.companyName && ` at ${applicant.companyName}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-300 font-semibold text-xs hover:from-primary-500/30 hover:to-secondary-500/30 transition-all duration-200 border border-primary-500/30"
                          onClick={() => handleViewProfile(applicant)}
                        >
                          <UserIcon className="h-3 w-3" />
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default MyCreatedJobs; 