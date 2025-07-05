import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const AlumniCard = ({ alumni, onRequestMentorship, onCardClick, buttonDisabled = false, buttonLabel = 'Request Mentorship' }) => {
  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on the button
    if (e.target.closest('button')) {
      return;
    }
    onCardClick(alumni);
  };

  // Determine button styling based on connection status
  const getButtonStyling = () => {
    if (alumni?.connectionStatus === 'accepted') {
      return 'bg-green-600 text-white hover:bg-green-700';
    } else if (alumni?.connectionStatus === 'pending') {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    } else if (alumni?.connectionStatus === 'rejected') {
      return 'bg-red-500 text-white hover:bg-red-600';
    } else {
      return buttonDisabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col h-full w-full max-w-sm sm:max-w-md md:max-w-lg p-3"
    >
      {/* Alumni Image */}
      <div className="relative h-28 bg-gray-200 flex-shrink-0 w-full rounded-2xl">
        {alumni.photoUrl ? (
          <img
            src={alumni.photoUrl}
            alt={alumni.name}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
            <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
          </div>
        )}
      </div>
      {/* Alumni Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Name */}
        <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-lg md:text-xl leading-tight line-clamp-2">
          {alumni.name}
        </h3>
        {/* Details */}
        <div className="space-y-1 mb-2">
          {/* Graduation Year */}
          {alumni.graduationYear && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
              {alumni.graduationYear}
            </div>
          )}
          {/* Course */}
          {alumni.course && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
              {alumni.course}
            </div>
          )}
          {/* Current Role */}
          {alumni.currentJobTitle && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>{alumni.currentJobTitle}</span>
            </div>
          )}
          {/* Company Name */}
          {alumni.companyName && (
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21V7a2 2 0 012-2h3V3h4v2h3a2 2 0 012 2v14M3 21h18" /></svg>
              <span>{alumni.companyName}</span>
            </div>
          )}
        </div>
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        {/* Connection Status Button Logic */}
        {alumni.connectionStatus === 'accepted' ? (
          <button
            className="mt-4 rounded-full px-4 py-1.5 font-semibold w-full shadow transition text-sm bg-green-600 text-white hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              // Don't do anything on click for accepted status
            }}
          >
            Connected
          </button>
        ) : alumni.connectionStatus === 'pending' ? (
          <button
            className="mt-4 rounded-full px-4 py-1.5 font-semibold w-full shadow transition text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
            disabled
          >
            Pending
          </button>
        ) : alumni.connectionStatus === 'rejected' ? (
          <button
            className="mt-4 rounded-full px-4 py-1.5 font-semibold w-full shadow transition text-sm bg-red-500 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRequestMentorship(alumni);
            }}
          >
            Rejected (Reapply)
          </button>
        ) : (
          <button
            className={`mt-4 rounded-full px-4 py-1.5 font-semibold w-full shadow transition text-sm ${getButtonStyling()}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!buttonDisabled) {
                onRequestMentorship(alumni);
              }
            }}
            disabled={buttonDisabled}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniCard; 
 
 