import React, { useState } from 'react';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';

// Mock applied jobs data
const mockAppliedJobs = [
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    companyName: 'Tech Solutions',
    description: 'Work on modern web apps using React.',
    deadline: '2024-08-01',
    registrationType: 'internal',
    status: 'pending',
  },
  {
    id: 2,
    jobTitle: 'Backend Engineer',
    companyName: 'Cloudify',
    description: 'Build scalable APIs and microservices.',
    deadline: '2024-08-10',
    registrationType: 'external',
    registrationLink: 'https://company.com/apply',
    status: 'accepted',
  },
  {
    id: 3,
    jobTitle: 'UI Designer',
    companyName: 'Designify',
    description: 'Design beautiful user interfaces.',
    deadline: '2024-08-15',
    registrationType: 'internal',
    status: 'rejected',
  },
];

const AppliedJobs = () => {
  const [subTab, setSubTab] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredJobs = mockAppliedJobs.filter(job => job.status === subTab);

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tabs */}
      <div className="flex flex-row gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${subTab === 'pending' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setSubTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${subTab === 'accepted' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setSubTab('accepted')}
        >
          Accepted
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${subTab === 'rejected' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setSubTab('rejected')}
        >
          Rejected
        </button>
      </div>
      {/* Sub-tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No jobs in this category.</div>
        ) : (
          filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleCardClick(job)}
              onApply={() => handleCardClick(job)}
            />
          ))
        )}
      </div>
      <JobDetailsModal
        job={selectedJob}
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => alert('Apply logic/modal goes here')}
      />
    </div>
  );
};

export default AppliedJobs; 