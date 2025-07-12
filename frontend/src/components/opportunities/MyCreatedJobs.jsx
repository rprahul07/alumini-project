import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import JobDetailsModal from './JobDetailsModal';
import ApplicantProfileModal from './ApplicantProfileModal';

const MyCreatedJobs = () => {
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
                <div className="text-xs text-gray-500">Status: {job.status}</div>
              </div>
              <div className="mt-3 sm:mt-0 flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={() => { setSelectedJob(job); setShowModal(true); }}
                >
                  View
                </button>
                <button
                  className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
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
      />
      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hide p-4 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowApplicationsModal(false)}
              aria-label="Close"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800">Applications</h2>
            {applicationsLoading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : applicationsError ? (
              <div className="text-center text-red-500">{applicationsError}</div>
            ) : applications.length === 0 ? (
              <div className="text-center text-gray-400">No applications for this job yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {applications.map((applicant, idx) => (
                  <div key={applicant.id || idx} className="bg-gray-50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate text-base">{applicant.name || '-'}</div>
                      <div className="text-xs text-gray-500 truncate">{applicant.email || '-'}</div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex gap-2 justify-end">
                      <button
                        className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                        onClick={() => { setSelectedApplicant(applicant); setShowProfileModal(true); }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Applicant Profile Modal */}
      <ApplicantProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default MyCreatedJobs; 