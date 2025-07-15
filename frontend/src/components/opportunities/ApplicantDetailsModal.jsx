import React from 'react';
import { 
  XMarkIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  GlobeAltIcon, 
  AcademicCapIcon, 
  UserIcon, 
  BuildingOfficeIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  IdentificationIcon,
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const ApplicantDetailsModal = ({ open, onClose, applicant }) => {
  if (!open || !applicant) return null;

  const data = applicant;
  
  // Debug: Log the data to see what we're receiving
  console.log('ApplicantDetailsModal data:', data);
  console.log('Applicant fields check:', {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    department: data.department,
    bio: data.bio,
    skills: data.skills,
    cvUrl: data.cvUrl,
    role: data.role,
    currentJobTitle: data.currentJobTitle,
    companyName: data.companyName,
    highestQualification: data.highestQualification,
    passoutYear: data.passoutYear,
    currentSemester: data.currentSemester,
    rollNumber: data.rollNumber,
    linkedInProfile: data.linkedInProfile,
    githubProfile: data.githubProfile,
    twitterProfile: data.twitterProfile,
    photoUrl: data.photoUrl
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Applicant Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Applicant Image */}
        <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
          {data.photoUrl ? (
            <img 
              src={data.photoUrl} 
              alt={data.name} 
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
              <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
            </div>
          )}
          
          {/* Role Badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
              data.role === 'alumni' ? 'bg-blue-100 text-blue-800' :
              data.role === 'student' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <UserIcon className="h-3 w-3 mr-1" />
              {data.role === 'alumni' ? 'Alumni' :
               data.role === 'student' ? 'Student' :
               'Applicant'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3">
          {/* Applicant Name */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
            {data.name}
          </h3>

          {/* Contact Information */}
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
            <div className="space-y-1">
              {data.email && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`mailto:${data.email}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {data.email}
                  </a>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${data.phone}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {data.phone}
                  </a>
                </div>
              )}
              {!data.email && !data.phone && (
                <div className="text-xs text-gray-400 italic">No contact information available</div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(data.linkedInProfile || data.githubProfile || data.twitterProfile) && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Social Links</h4>
              <div className="flex items-center gap-4">
                {data.linkedInProfile && (
                  <a href={data.linkedInProfile} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaLinkedin size={20} color="#0077B5" />
                  </a>
                )}
                {data.githubProfile && (
                  <a href={data.githubProfile} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaGithub size={20} color="#181717" />
                  </a>
                )}
                {data.twitterProfile && (
                  <a href={data.twitterProfile} target="_blank" rel="noopener noreferrer" title="Twitter" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <FaTwitter size={20} color="#1DA1F2" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Education & Academic Details */}
          {(data.highestQualification || data.passoutYear || data.course || data.department || data.currentSemester || data.rollNumber || data.batchStartYear || data.batchEndYear) && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Education & Academic Details</h4>
              <div className="space-y-1">
                {data.department && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Department:</span>
                    <span className="ml-1 capitalize">{data.department}</span>
                  </div>
                )}
                {data.highestQualification && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{data.highestQualification}</span>
                    {data.passoutYear && (
                      <span className="text-gray-400 ml-1">({data.passoutYear})</span>
                    )}
                  </div>
                )}
                {data.course && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 ml-6">
                    <span>Course: {data.course}</span>
                  </div>
                )}
                {data.currentSemester && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Semester:</span>
                    <span className="ml-1">{data.currentSemester}</span>
                  </div>
                )}
                {data.rollNumber && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <IdentificationIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Roll Number:</span>
                    <span className="ml-1">{data.rollNumber}</span>
                  </div>
                )}
                {(data.batchStartYear || data.batchEndYear) && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Batch:</span>
                    <span className="ml-1">
                      {data.batchStartYear && data.batchEndYear 
                        ? `${data.batchStartYear} - ${data.batchEndYear}`
                        : data.batchStartYear || data.batchEndYear
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {(data.currentJobTitle || data.companyName || data.companyRole || data.totalExperience) && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Experience</h4>
              <div className="space-y-1">
                {data.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{data.currentJobTitle}</span>
                    {data.companyName && (
                      <span className="text-gray-400 ml-1">at {data.companyName}</span>
                    )}
                  </div>
                )}
                {data.companyRole && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 ml-6">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Role: {data.companyRole}</span>
                  </div>
                )}
                {data.totalExperience && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 ml-6">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Experience: {data.totalExperience} years</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 ? (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                  >
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Skills</h4>
              <div className="text-xs text-gray-400 italic">No skills listed</div>
            </div>
          )}

          {/* Bio */}
          {data.bio ? (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                {data.bio}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
              <div className="text-xs text-gray-400 italic">No bio available</div>
            </div>
          )}

          {/* Resume/CV */}
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Resume / CV</h4>
            <div className="flex items-center gap-2">
              <DocumentArrowDownIcon className="h-4 w-4 text-gray-400" />
              {data.cvUrl && data.cvUrl !== '#' ? (
                <div className="flex items-center gap-2">
                  <a 
                    href={data.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-600 hover:text-green-800 transition-colors font-medium text-sm"
                  >
                    View CV
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href={data.cvUrl} 
                    download 
                    className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm"
                  >
                    Download CV
                  </a>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No CV uploaded</span>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal; 