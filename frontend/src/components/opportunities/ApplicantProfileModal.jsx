import React from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, BriefcaseIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const ApplicantProfileModal = ({ open, onClose, applicant }) => {
  if (!open) return null;
  const data = applicant || {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '9876543210',
    highestQualification: 'MCA',
    passoutYear: '2021',
    currentJobTitle: 'UI Designer',
    totalExperience: 3,
    linkedInProfile: 'https://linkedin.com/in/alicejohnson',
    cvUrl: '#',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 relative" style={{ scrollbarWidth: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Applicant Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Applicant Image/Banner */}
        <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
            <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
          </div>
          {/* Applicant Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
              <UserIcon className="h-3 w-3 mr-1" />Applicant
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3">
          {/* Contact Information */}
          <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
              <a href={`mailto:${data.email}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">{data.email}</a>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
              <a href={`tel:${data.phone}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">{data.phone}</a>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
              <a href={data.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors">LinkedIn Profile</a>
            </div>
          </div>

          {/* Education */}
          <h4 className="text-base font-semibold text-gray-900 mb-1">Education</h4>
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{data.highestQualification} ({data.passoutYear})</span>
            </div>
          </div>

          {/* Experience */}
          <h4 className="text-base font-semibold text-gray-900 mb-1">Experience</h4>
          <div className="space-y-1 mb-3">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{data.currentJobTitle} &middot; {data.totalExperience} years</span>
            </div>
          </div>

          {/* Resume/CV */}
          <h4 className="text-base font-semibold text-gray-900 mb-1">Resume / CV</h4>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2 text-gray-400" />
            {data.cvUrl && data.cvUrl !== '#' ? (
              <a href={data.cvUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors font-medium">View CV</a>
            ) : (
              <span className="text-gray-400">No CV uploaded</span>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfileModal; 