import React, { useState } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import StudentDetailsModal from './StudentDetailsModal';

const StudentCard = ({ student }) => {
  const [showModal, setShowModal] = useState(false);

  // Extract fields
  const name = student.fullName || student.name || (student.user && student.user.fullName) || '';
  const department = student.department || (student.user && student.user.department) || '';
  const currentSemester = student.student?.currentSemester || student.currentSemester || '';
  const photoUrl = student.photoUrl || (student.user && student.user.photoUrl) || '';
  
  // Get the correct student ID - now the backend provides userId
  const studentId = student.userId || student.id || student.user?.id;

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (!studentId) {
      console.error('No student ID available');
      return;
    }
    setShowModal(true);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    if (!studentId) {
      console.error('No student ID available');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white shadow-md rounded-2xl w-full max-w-sm flex flex-col h-full cursor-pointer"
      >
        {/* Image at the top */}
        <div className="relative h-28 bg-gray-200 flex-shrink-0 w-full rounded-t-2xl">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover rounded-t-2xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-t-2xl">
              <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          {/* Details, each on its own line */}
          {department && (
            <p className="text-sm text-gray-500 mb-1 flex items-center"><AcademicCapIcon className="h-4 w-4 mr-1 text-gray-400" />{department}</p>
          )}
          {currentSemester && (
            <p className="text-sm text-gray-500 mb-1 flex items-center"><AcademicCapIcon className="h-4 w-4 mr-1 text-gray-400" />Semester {currentSemester}</p>
          )}
          {/* Spacer */}
          <div className="flex-grow"></div>
          {/* Footer: Button */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="rounded-full px-4 py-1.5 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleViewClick}
              disabled={!studentId}
            >
              View
            </button>
          </div>
        </div>
      </div>
      
      {/* Render modal when showModal is true */}
      {showModal && (
        <StudentDetailsModal
          studentId={studentId}
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default StudentCard; 