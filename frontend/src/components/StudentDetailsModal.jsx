import React, { useEffect, useState } from 'react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Student Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">
            <div className="mb-4">{error}</div>
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Student Image + Role badge */}
            <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2 flex items-center justify-center overflow-hidden">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                  <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">Student</span>
              </div>
            </div>

            {/* Student Content */}
            <div className="p-2 sm:p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Name */}
              <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl leading-tight">{name}</h3>

              {/* Contact Information */}
              {email && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={`mailto:${email}`}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(linkedinUrl || githubUrl || twitterUrl) && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Social Links</h4>
                  <div className="flex items-center gap-4">
                    {linkedinUrl && (
                      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FaLinkedin size={20} color="#0077B5" />
                      </a>
                    )}
                    {githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FaGithub size={20} color="#181717" />
                      </a>
                    )}
                    {twitterUrl && (
                      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FaTwitter size={20} color="#1DA1F2" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Academic Details */}
              {(department || currentSemester || rollNumber || graduationYear || batchStartYear) && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Academic Details</h4>
                  <div className="space-y-1">
                    {department && (
                      <div className="flex items-center text-sm text-gray-500">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Department:</span>
                        <span className="ml-1 capitalize">{department}</span>
                      </div>
                    )}
                    {currentSemester && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Semester:</span>
                        <span className="ml-1">{currentSemester}</span>
                      </div>
                    )}
                    {rollNumber && (
                      <div className="flex items-center text-sm text-gray-500">
                        <IdentificationIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Roll Number:</span>
                        <span className="ml-1">{rollNumber}</span>
                      </div>
                    )}
                    {graduationYear && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Graduation Year:</span>
                        <span className="ml-1">{graduationYear}</span>
                      </div>
                    )}
                    {batchStartYear && (
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Batch Start Year:</span>
                        <span className="ml-1">{batchStartYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 ? (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
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
              {bio ? (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                    {bio}
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
                  {resumeUrl && resumeUrl !== '#' ? (
                    <div className="flex items-center gap-2">
                      <a 
                        href={resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-600 hover:text-green-800 transition-colors font-medium text-sm"
                      >
                        <EyeIcon className="h-4 w-4 inline mr-1" />
                        View CV
                      </a>
                      <span className="text-gray-400">•</span>
                      <a 
                        href={resumeUrl} 
                        download 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsModal; 