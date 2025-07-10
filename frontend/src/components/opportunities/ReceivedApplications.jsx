import React, { useState } from 'react';
import JobCard from './JobCard';
import JobDetailsModal from './JobDetailsModal';
import ApplicantProfileModal from './ApplicantProfileModal';

// Mock received applications data
const initialApplications = [
  {
    id: 101,
    jobTitle: 'Frontend Developer',
    companyName: 'Tech Solutions',
    description: 'Work on modern web apps using React.',
    deadline: '2024-08-01',
    registrationType: 'internal',
    status: 'pending',
    applicantName: 'Alice Johnson',
    applicant: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '9876543210',
      highestQualification: 'MCA',
      passoutYear: '2021',
      currentJobTitle: 'UI Designer',
      totalExperience: 3,
      linkedInProfile: 'https://linkedin.com/in/alicejohnson',
      cvUrl: '#',
    },
  },
  {
    id: 102,
    jobTitle: 'Backend Engineer',
    companyName: 'Cloudify',
    description: 'Build scalable APIs and microservices.',
    deadline: '2024-08-10',
    registrationType: 'external',
    registrationLink: 'https://company.com/apply',
    status: 'accepted',
    applicantName: 'Bob Smith',
    applicant: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '1231231234',
      highestQualification: 'B.Tech',
      passoutYear: '2020',
      currentJobTitle: 'Backend Engineer',
      totalExperience: 4,
      linkedInProfile: 'https://linkedin.com/in/bobsmith',
      cvUrl: '#',
    },
  },
  {
    id: 103,
    jobTitle: 'UI Designer',
    companyName: 'Designify',
    description: 'Design beautiful user interfaces.',
    deadline: '2024-08-15',
    registrationType: 'internal',
    status: 'rejected',
    applicantName: 'Charlie Brown',
    applicant: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '5555555555',
      highestQualification: 'B.Des',
      passoutYear: '2019',
      currentJobTitle: 'UI Designer',
      totalExperience: 2,
      linkedInProfile: 'https://linkedin.com/in/charliebrown',
      cvUrl: '#',
    },
  },
];

const ReceivedApplications = () => {
  const [subTab, setSubTab] = useState('pending');
  const [applications, setApplications] = useState(initialApplications);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const filteredApplications = applications.filter(app => app.status === subTab);

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleProfileClick = (applicant) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(applications.filter(app => app.id !== id));
    }
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
        {filteredApplications.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No applications in this category.</div>
        ) : (
          filteredApplications.map(app => (
            <div key={app.id} className="relative">
              <JobCard
                job={app}
                onClick={() => handleCardClick(app)}
                onApply={() => handleCardClick(app)}
              />
              <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                {app.applicantName}
              </div>
              <button
                className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={e => { e.stopPropagation(); handleProfileClick(app.applicant); }}
              >
                View Profile
              </button>
              <button
                className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                onClick={e => { e.stopPropagation(); handleDelete(app.id); }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      <JobDetailsModal
        job={selectedJob}
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => alert('View applicant profile logic/modal goes here')}
      />
      <ApplicantProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        applicant={selectedApplicant}
      />
    </div>
  );
};

export default ReceivedApplications; 