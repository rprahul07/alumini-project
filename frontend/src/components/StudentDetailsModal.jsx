import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { XMarkIcon, AcademicCapIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const StudentDetailsModal = ({ studentId, open, onClose }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/student/${studentId}`);
        if (response.data.success) {
          setStudent(response.data.student || response.data.data);
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

  // Extract fields
  const name = student?.fullName || student?.name || (student?.user && student.user.fullName) || '';
  const department = student?.department || (student?.user && student.user.department) || '';
  const rollNumber = student?.student?.rollNumber || student?.rollNumber || '';
  const currentSemester = student?.student?.currentSemester || student?.currentSemester || '';
  const graduationYear = student?.student?.graduationYear || student?.graduationYear || '';
  const photoUrl = student?.photoUrl || (student?.user && student.user.photoUrl) || '';
  const email = student?.email || (student?.user && student.user.email) || '';
  const phone = student?.phoneNumber || (student?.user && student.user.phoneNumber) || '';
  const bio = student?.bio || '';
  const linkedinUrl = student?.linkedinUrl || '';
  const githubUrl = student?.githubUrl || '';
  const twitterUrl = student?.twitterUrl || '';

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
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">student</span>
          </div>
        </div>
        {/* Student Content */}
        <div className="p-2 sm:p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Name */}
          <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl leading-tight">{name}</h3>
          {/* Details, each in its own row, left-aligned, with icon and label */}
          <div className="space-y-2 mb-3">
            {department && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
                <span className="font-medium">Department:</span>
                <span className="capitalize">{department}</span>
              </div>
            )}
            {currentSemester && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
                <span className="font-medium">Semester:</span>
                <span>{currentSemester}</span>
              </div>
            )}
            {rollNumber && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <IdentificationIcon className="h-4 w-4 text-indigo-400" />
                <span className="font-medium">Roll Number:</span>
                <span>{rollNumber}</span>
              </div>
            )}
            {graduationYear && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
                <span className="font-medium">Graduation Year:</span>
                <span>{graduationYear}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <EnvelopeIcon className="h-4 w-4 text-indigo-400" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <PhoneIcon className="h-4 w-4 text-indigo-400" />
                <span>{phone}</span>
              </div>
            )}
          </div>
          {/* Socials, left-aligned below details, with label and icon+link */}
          {(linkedinUrl || githubUrl || twitterUrl) && (
            <div className="flex items-center gap-4 mb-3">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="flex items-center gap-1">
                  <FaLinkedin size={20} color="#0077B5" />
                  <span className="text-sm text-indigo-600 font-medium hover:underline">LinkedIn</span>
                </a>
              )}
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="flex items-center gap-1">
                  <FaGithub size={20} color="#181717" />
                  <span className="text-sm text-indigo-600 font-medium hover:underline">GitHub</span>
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter" className="flex items-center gap-1">
                  <FaTwitter size={20} color="#1DA1F2" />
                  <span className="text-sm text-indigo-600 font-medium hover:underline">Twitter</span>
                </a>
              )}
            </div>
          )}
          {/* Bio, left-aligned, last */}
          {bio && (
            <div className="mb-3">
              <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                {bio}
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center py-10">{error}</div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsModal; 