import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../config/axios';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  EnvelopeIcon, 
  IdentificationIcon,
  CalendarIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
// Replaced with inline SVGs to reduce bundle size
// import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const StudentDetailsModal = ({ studentId, open, onClose }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    
    if (!studentId) {
      setError('No student ID provided');
      setLoading(false);
      return;
    }
    
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/student/${studentId}`);
        
        if (response.data.success) {
          setStudent(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch student details');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [studentId, open]);

  if (!open) return null;

  // Extract fields with safe fallbacks
  const name = student?.fullName || '';
  const department = student?.department || '';
  const rollNumber = student?.student?.rollNumber || '';
  const currentSemester = student?.student?.currentSemester || '';
  const graduationYear = student?.student?.graduationYear || '';
  const batchStartYear = student?.student?.batch_startYear || '';
  const photoUrl = student?.photoUrl || '';
  const email = student?.email || '';
  const bio = student?.bio || '';
  const linkedinUrl = student?.linkedinUrl || '';
  const githubUrl = student?.githubUrl || '';
  const twitterUrl = student?.twitterUrl || '';
  const skills = student?.skills || [];
  const resumeUrl = student?.resumeUrl || '';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-[999999]"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-6 border border-white/20 shadow-2xl relative"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-secondary-400/10 rounded-3xl animate-pulse"></div>
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 font-display">
              Student Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white/70 hover:text-white hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="relative z-10 flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400"></div>
            </div>
          ) : error ? (
            <div className="relative z-10 text-red-300 text-center py-10">
              <div className="mb-4">{error}</div>
              <button
                onClick={onClose}
                className="rounded-2xl px-6 py-3 font-semibold border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <>
            {/* Student Image + Role badge */}
            <div className="relative z-10 h-32 sm:h-40 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 overflow-hidden border border-white/20">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-3xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-gray-900/80 rounded-3xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full flex items-center justify-center border-2 border-white/20">
                    <AcademicCapIcon className="h-10 w-10 text-white/80" />
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-400/50 backdrop-blur-sm">Student</span>
              </div>
            </div>

            {/* Student Content */}
            <div className="relative z-10 space-y-6">
              {/* Name */}
              <h3 className="font-bold text-white mb-4 text-2xl sm:text-3xl leading-tight font-display">{name}</h3>

              {/* Contact Information */}
              {email && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
                  <div className="flex items-center text-sm text-gray-300">
                    <EnvelopeIcon className="h-5 w-5 mr-3 text-primary-400" />
                    <a 
                      href={`mailto:${email}`}
                      className="text-primary-300 hover:text-primary-200 transition-colors font-medium"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(linkedinUrl || githubUrl || twitterUrl) && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Social Links</h4>
                  <div className="flex items-center gap-4">
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                        <svg className="w-5 h-5" fill="#60A5FA" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                        <svg className="w-5 h-5" fill="#A78BFA" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                    {twitterUrl && (
                      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter" className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                        <svg className="w-5 h-5" fill="#34D399" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Academic Details */}
              {(department || currentSemester || rollNumber || graduationYear || batchStartYear) && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Academic Details</h4>
                  <div className="space-y-3">
                    {department && (
                      <div className="flex items-center text-sm text-gray-300">
                        <AcademicCapIcon className="h-5 w-5 mr-3 text-primary-400" />
                        <span className="font-medium">Department:</span>
                        <span className="ml-2 capitalize text-white">{department}</span>
                      </div>
                    )}
                    {currentSemester && (
                      <div className="flex items-center text-sm text-gray-300">
                        <CalendarIcon className="h-5 w-5 mr-3 text-secondary-400" />
                        <span className="font-medium">Semester:</span>
                        <span className="ml-2 text-white">{currentSemester}</span>
                      </div>
                    )}
                    {rollNumber && (
                      <div className="flex items-center text-sm text-gray-300">
                        <IdentificationIcon className="h-5 w-5 mr-3 text-accent-400" />
                        <span className="font-medium">Roll Number:</span>
                        <span className="ml-2 text-white">{rollNumber}</span>
                      </div>
                    )}
                    {graduationYear && (
                      <div className="flex items-center text-sm text-gray-300">
                        <CalendarIcon className="h-5 w-5 mr-3 text-primary-300" />
                        <span className="font-medium">Graduation Year:</span>
                        <span className="ml-2 text-white">{graduationYear}</span>
                      </div>
                    )}
                    {batchStartYear && (
                      <div className="flex items-center text-sm text-gray-300">
                        <CalendarIcon className="h-5 w-5 mr-3 text-secondary-300" />
                        <span className="font-medium">Batch Start Year:</span>
                        <span className="ml-2 text-white">{batchStartYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Skills</h4>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-2 rounded-2xl text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2 text-accent-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Skills</h4>
                  <div className="text-sm text-gray-400 italic">No skills listed</div>
                </div>
              )}

              {/* Bio */}
              {bio ? (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Bio</h4>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words border border-white/20">
                    {bio}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3 font-display">Bio</h4>
                  <div className="text-sm text-gray-400 italic">No bio available</div>
                </div>
              )}

              {/* Resume/CV */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 font-display">Resume / CV</h4>
                <div className="flex items-center gap-3">
                  <DocumentArrowDownIcon className="h-5 w-5 text-gray-400" />
                  {resumeUrl && resumeUrl !== '#' ? (
                    <div className="flex items-center gap-4">
                      <a 
                        href={resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-300 hover:text-green-200 transition-colors font-medium text-sm bg-green-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-green-400/20 hover:bg-green-500/20"
                      >
                        <EyeIcon className="h-4 w-4 inline mr-2" />
                        View CV
                      </a>
                      <a 
                        href={resumeUrl} 
                        download 
                        className="text-primary-300 hover:text-primary-200 transition-colors font-medium text-sm bg-primary-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-primary-400/20 hover:bg-primary-500/20"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />
                        Download CV
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No CV uploaded</span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-2xl px-6 py-3 font-semibold border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  Close
                </button>
              </div>
            </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentDetailsModal; 