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
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

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
                        <FaLinkedin size={20} color="#60A5FA" />
                      </a>
                    )}
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                        <FaGithub size={20} color="#A78BFA" />
                      </a>
                    )}
                    {twitterUrl && (
                      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter" className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
                        <FaTwitter size={20} color="#34D399" />
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