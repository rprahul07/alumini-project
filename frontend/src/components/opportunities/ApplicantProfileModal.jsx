import React from 'react';

// Mock applicant data (replace with real data when available)
const mockApplicant = {
  name: 'Alice Johnson',
  email: 'alice@example.com',
  phone: '9876543210',
  highestQualification: 'MCA',
  passoutYear: '2021',
  currentJobTitle: 'UI Designer',
  totalExperience: 3,
  linkedInProfile: 'https://linkedin.com/in/alicejohnson',
  cvUrl: '#', // Replace with real CV URL
};

const ApplicantProfileModal = ({ open, onClose, applicant }) => {
  const data = applicant || mockApplicant;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Applicant Profile</h2>
        <div className="space-y-2 mb-4">
          <div><span className="font-semibold">Name:</span> {data.name}</div>
          <div><span className="font-semibold">Email:</span> {data.email}</div>
          <div><span className="font-semibold">Phone:</span> {data.phone}</div>
          <div><span className="font-semibold">LinkedIn:</span> <a href={data.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.linkedInProfile}</a></div>
          <div><span className="font-semibold">Highest Qualification:</span> {data.highestQualification}</div>
          <div><span className="font-semibold">Passout Year:</span> {data.passoutYear}</div>
          <div><span className="font-semibold">Current Job Title:</span> {data.currentJobTitle}</div>
          <div><span className="font-semibold">Total Experience:</span> {data.totalExperience} years</div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Resume/CV:</span>{' '}
          <a href={data.cvUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Download/View CV</a>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileModal; 