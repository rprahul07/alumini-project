import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';

const StudentCard = ({ student, onCardClick }) => {

  // Extract fields
  const name = student.fullName || student.name || (student.user && student.user.fullName) || '';
  const department = student.department || (student.user && student.user.department) || '';
  const currentSemester = student.student?.currentSemester || student.currentSemester || '';
  const photoUrl = student.photoUrl || (student.user && student.user.photoUrl) || '';
  
  // Get the correct student ID - now the backend provides userId
  const studentId = student.id || student.user?.id;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (!studentId) {
      console.error('No student ID available');
      return;
    }
    onCardClick && onCardClick(student);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    if (!studentId) {
      console.error('No student ID available');
      return;
    }
    onCardClick && onCardClick(student);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-lg rounded-2xl w-full max-w-sm flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-10"
    >
        {/* Image at the top */}
        <div className="relative h-32 bg-gray-200 flex-shrink-0 w-full rounded-t-2xl overflow-hidden">
          {photoUrl ? (
            <OptimizedImage
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover rounded-t-2xl"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-2xl">
              <AcademicCapIcon className="h-12 w-12 text-primary-400" />
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          {/* Details, each on its own line */}
          {department && (
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-2 text-primary-500" />
              {department}
            </p>
          )}
          {currentSemester && (
            <p className="text-sm text-gray-600 mb-3 flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-2 text-secondary-500" />
              Semester {currentSemester}
            </p>
          )}
          {/* Spacer */}
          <div className="flex-grow"></div>
          {/* Footer: Button */}
          <div className="flex flex-col gap-2 mt-3">
            <button
              className="rounded-full px-4 py-2 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-primary text-white hover:bg-primary-700 shadow-md hover:shadow-lg"
              onClick={handleViewClick}
              disabled={!studentId}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
  );
};

export default StudentCard; 