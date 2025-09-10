import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
// Replaced with Heroicons to reduce bundle size
// import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const ApplicantDetailsModal = ({ open, onClose, applicant }) => {
  if (!open || !applicant) return null;

  const data = applicant;
  
  // Debug info removed for production

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 backdrop-blur-2xl rounded-xl lg:rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-hide p-2 sm:p-3 border border-white/20 shadow-2xl" style={{ scrollbarWidth: 'none' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white">Applicant Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-1"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.button>
        </div>

        {/* Applicant Image */}
        <div className="relative h-24 sm:h-28 lg:h-36 bg-white/10 rounded-xl lg:rounded-2xl mb-3 sm:mb-4 border border-white/20">
          {data.photoUrl ? (
            <img 
              src={data.photoUrl} 
              alt={data.name} 
              className="w-full h-full object-cover rounded-xl lg:rounded-2xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl lg:rounded-2xl">
              <AcademicCapIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary-400" />
            </div>
          )}
          
          {/* Role Badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
              data.role === 'alumni' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              data.role === 'student' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
              'bg-gray-500/20 text-gray-300 border-gray-500/30'
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
          <h3 className="font-bold text-white mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
            {data.name}
          </h3>

          {/* Contact Information */}
          <div className="mb-3">
            <h4 className="text-base font-semibold text-white mb-1">Contact Information</h4>
            <div className="space-y-1">
              {data.email && (
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-400" />
                  <a 
                    href={`mailto:${data.email}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {data.email}
                  </a>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <PhoneIcon className="h-4 w-4 mr-2 text-primary-400" />
                  <a 
                    href={`tel:${data.phone}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
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
              <h4 className="text-base font-semibold text-white mb-1">Social Links</h4>
              <div className="flex items-center gap-4">
                {data.linkedInProfile && (
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={data.linkedInProfile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="LinkedIn" 
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </motion.a>
                )}
                {data.githubProfile && (
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={data.githubProfile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="GitHub" 
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="#181717" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                )}
                {data.twitterProfile && (
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href={data.twitterProfile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title="Twitter" 
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          )}

          {/* Education & Academic Details */}
          {(data.highestQualification || data.passoutYear || data.course || data.department || data.currentSemester || data.rollNumber || data.batchStartYear || data.batchEndYear) && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-white mb-1">Education & Academic Details</h4>
              <div className="space-y-1">
                {data.department && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span className="font-medium">Department:</span>
                    <span className="ml-1 capitalize">{data.department}</span>
                  </div>
                )}
                {data.highestQualification && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span>{data.highestQualification}</span>
                    {data.passoutYear && (
                      <span className="text-gray-400 ml-1">({data.passoutYear})</span>
                    )}
                  </div>
                )}
                {data.course && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300 ml-6">
                    <span>Course: {data.course}</span>
                  </div>
                )}
                {data.currentSemester && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span className="font-medium">Semester:</span>
                    <span className="ml-1">{data.currentSemester}</span>
                  </div>
                )}
                {data.rollNumber && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <IdentificationIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span className="font-medium">Roll Number:</span>
                    <span className="ml-1">{data.rollNumber}</span>
                  </div>
                )}
                {(data.batchStartYear || data.batchEndYear) && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary-400" />
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
              <h4 className="text-base font-semibold text-white mb-1">Experience</h4>
              <div className="space-y-1">
                {data.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <UserIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span>{data.currentJobTitle}</span>
                    {data.companyName && (
                      <span className="text-gray-400 ml-1">at {data.companyName}</span>
                    )}
                  </div>
                )}
                {data.companyRole && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300 ml-6">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span>Role: {data.companyRole}</span>
                  </div>
                )}
                {data.totalExperience && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300 ml-6">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary-400" />
                    <span>Experience: {data.totalExperience} years</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 ? (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-white mb-1">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <motion.span 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30"
                  >
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-white mb-1">Skills</h4>
              <div className="text-xs text-gray-400 italic">No skills listed</div>
            </div>
          )}

          {/* Bio */}
          {data.bio ? (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-white mb-1">Bio</h4>
              <div className="bg-white/10 rounded-lg p-3 text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words">
                {data.bio}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-white mb-1">Bio</h4>
              <div className="text-xs text-gray-400 italic">No bio available</div>
            </div>
          )}

          {/* Resume/CV */}
          <div className="mb-3">
            <h4 className="text-base font-semibold text-white mb-1">Resume / CV</h4>
            <div className="flex items-center gap-2">
              <DocumentArrowDownIcon className="h-4 w-4 text-primary-400" />
              {data.cvUrl && data.cvUrl !== '#' ? (
                <div className="flex items-center gap-2">
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={data.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-400 hover:text-green-300 transition-colors font-medium text-sm"
                  >
                    View CV
                  </motion.a>
                  <span className="text-gray-400">•</span>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={data.cvUrl} 
                    download 
                    className="text-primary-400 hover:text-primary-300 transition-colors font-medium text-sm"
                  >
                    Download CV
                  </motion.a>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No CV uploaded</span>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-4 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-200"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ApplicantDetailsModal; 