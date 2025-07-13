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

const MyCreatedJobs = ({ showAlert }) => {
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
      console.log('API response for applications:', res.data);
      console.log('Applications data:', res.data.data);
      console.log('First applicant (if any):', res.data.data?.[0]);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setApplicationsError('Failed to load applications.');
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
    console.log('Selected applicant data:', applicant);
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
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
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate text-base">{job.jobTitle || '-'}</div>
                <div className="text-sm text-gray-700 truncate">{job.companyName || '-'}</div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'approved' ? 'bg-green-100 text-green-700' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status === 'approved' ? '✓ Approved' :
                     job.status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                  </span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2 justify-end">
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                  onClick={() => { setSelectedJob(job); setShowModal(true); }}
                >
                  View
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition-colors"
                  onClick={() => handleViewApplications(job.id)}
                >
                  Applications
                </button>
              </div>
            </div>
          ))}
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">Job Applications</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedJob?.jobTitle} at {selectedJob?.companyName}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              {/* Application Count Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {applicationsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <div className="text-gray-500 text-lg">Loading applications...</div>
                </div>
              ) : applicationsError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-500 text-lg font-semibold mb-4">{applicationsError}</div>
                  <button
                    onClick={() => handleViewApplications(selectedJob?.id)}
                    className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="text-gray-500 text-lg font-medium mb-2">No applications yet</div>
                  <div className="text-gray-400 text-sm text-center">
                    Applicants will appear here once they apply for this job
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((applicant, idx) => (
                    <div key={applicant.id || idx} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Applicant Avatar */}
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                          
                          {/* Applicant Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{applicant.name || 'Unknown Applicant'}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Role Badge */}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                applicant.role === 'alumni' ? 'bg-blue-100 text-blue-700' :
                                applicant.role === 'student' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {applicant.role === 'alumni' ? 'Alumni' :
                                 applicant.role === 'student' ? 'Student' :
                                 applicant.role || 'Unknown'}
                              </span>
                              
                              {/* Current Role (if available) */}
                              {applicant.currentJobTitle && (
                                <span className="text-sm text-gray-500 truncate">
                                  • {applicant.currentJobTitle}
                                  {applicant.companyName && ` at ${applicant.companyName}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
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