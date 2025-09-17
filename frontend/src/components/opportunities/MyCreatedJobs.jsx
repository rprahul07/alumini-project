import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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
      <h3 className="text-lg font-semibold mb-4 text-slate-900">My Created Jobs</h3>
      {loading ? (
        <div className="text-center text-slate-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-slate-600">You have not created any jobs yet.</div>
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
              className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-4 hover:bg-slate-200 transition-colors duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-base mb-1 truncate">{job.jobTitle || '-'}</h3>
                    <p className="text-sm text-slate-600 truncate">{job.companyName || '-'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    job.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
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
                    className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                    onClick={() => { setSelectedJob(job); setShowModal(true); }}
                  >
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
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
          className="hidden lg:block h-full overflow-x-auto rounded-xl shadow-2xl bg-slate-50 backdrop-blur-xl border border-slate-200"
        >
          <table className="w-full table-fixed divide-y divide-slate-200 text-xs h-full" role="grid" aria-label="My created jobs table">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-slate-700 uppercase tracking-wider">Job Title</th>
                <th className="px-2 py-2 w-32 text-left font-medium text-slate-700 uppercase tracking-wider">Company</th>
                <th className="px-2 py-2 w-24 text-left font-medium text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
          {jobs.map((job, index) => (
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
                  <td className="px-2 py-2 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    job.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
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
      {showApplicationsModal && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl lg:rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide p-3 sm:p-4 lg:p-6 border border-slate-200 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 font-display">Job Applications</h2>
              <button onClick={() => setShowApplicationsModal(false)} className="text-slate-500 hover:text-slate-700 transition-colors p-1 sm:p-2 rounded-full hover:bg-slate-100">
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Job Info */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl lg:text-2xl leading-tight mb-2">
                {selectedJob?.jobTitle}
              </h3>
              <p className="text-slate-600 mb-3">
                {selectedJob?.companyName}
              </p>
              {/* Application Count Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200">
                <UserIcon className="h-4 w-4 mr-1" />
                {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
              </span>
            </div>

            {/* Content */}
            <div>
              {applicationsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-3"></div>
                  <div className="text-slate-600">Loading applications...</div>
                </div>
              ) : applicationsError ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-red-500 mb-2">{applicationsError}</div>
                  <button
                    onClick={() => handleViewApplications(selectedJob?.id)}
                    className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
                  >
                    Retry
                  </button>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 border border-slate-200">
                    <UserIcon className="h-6 w-6 text-slate-400" />
                  </div>
                  <div className="text-slate-600 mb-2">No applications yet</div>
                  <div className="text-slate-500 text-sm text-center">
                    Applicants will appear here once they apply for this job
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((applicant, idx) => (
                    <div 
                      key={applicant.id || idx} 
                      className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 border border-slate-200 hover:bg-white/90 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Applicant Avatar */}
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center border border-primary-200">
                            <UserIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          
                          {/* Applicant Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{applicant.name || 'Unknown Applicant'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Role Badge */}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                applicant.role === 'alumni' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                applicant.role === 'student' ? 'bg-green-100 text-green-700 border-green-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                              }`}>
                                {applicant.role === 'alumni' ? 'Alumni' :
                                 applicant.role === 'student' ? 'Student' :
                                 applicant.role || 'Unknown'}
                              </span>
                              
                              {/* Current Role (if available) */}
                              {applicant.currentJobTitle && (
                                <span className="text-sm text-slate-600 truncate">
                                  • {applicant.currentJobTitle}
                                  {applicant.companyName && ` at ${applicant.companyName}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                          onClick={() => handleViewProfile(applicant)}
                        >
                          <UserIcon className="h-3 w-3" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
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