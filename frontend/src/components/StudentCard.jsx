import React, { memo } from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { Mail, Linkedin } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const StudentCard = memo(({
  student,
  onCardClick,
  buttonDisabled = false,
  buttonLabel = 'View Profile',
  user = null,
}) => {
  // Destructure student data with fallbacks
  const {
    fullName = student.name || student.fullName || 'Unknown',
    photoUrl,
    department,
    currentSemester,
    tags = [],
    linkedinUrl,
    email,
    connectionStatus,
  } = student || {};

  // Get the correct student ID - now the backend provides userId
  const studentId = student.id || student.user?.id;

  // Button logic for connection status
  let displayButton = null;
  
  // Hide view profile button for admin users (optional - can be removed if not needed)
  if (user && user.role === 'admin') {
    displayButton = null;
  } else if (buttonLabel === "You can't send yourself") {
    displayButton = (
      <button
        className="rounded-full px-4 py-1.5 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-gray-200 text-gray-400 cursor-not-allowed"
        disabled
        onClick={e => e.stopPropagation()}
      >
        {buttonLabel}
      </button>
    );
  } else if (connectionStatus === 'accepted') {
    displayButton = (
      <button
        className="rounded-full px-4 py-1.5 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-green-600 text-white hover:bg-green-700 cursor-default"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Connected
      </button>
    );
  } else if (connectionStatus === 'pending') {
    displayButton = (
      <button
        className="rounded-full px-4 py-1.5 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-gray-100 text-gray-500 cursor-not-allowed"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Pending
      </button>
    );
  } else if (connectionStatus === 'rejected') {
    displayButton = (
      <button
        className="rounded-full px-4 py-1.5 font-semibold w-full text-sm flex items-center justify-center transition-colors bg-red-500 text-white hover:bg-red-600"
        onClick={e => {
          e.stopPropagation();
          onCardClick && onCardClick(student);
        }}
      >
        Rejected (Reapply)
      </button>
    );
  } else {
    displayButton = (
      <button
        className="rounded-full px-4 py-2 font-semibold w-full text-sm flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:scale-105"
        onClick={e => {
          e.stopPropagation();
          if (!buttonDisabled) {
            onCardClick && onCardClick(student);
          }
        }}
        disabled={buttonDisabled}
      >
        {buttonLabel}
      </button>
    );
  }

  // Card click handler (ignore clicks on button or social icons)
  const handleCardClick = e => {
    if (e.target.closest('button, a')) return;
    onCardClick && onCardClick(student);
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-sm flex flex-col h-full cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-105 z-10 border border-white/20 hover:border-white/30"
      onClick={handleCardClick}
    >
      {/* Image at the top */}
      <div className="relative h-32 bg-gray-200 flex-shrink-0 w-full rounded-t-2xl overflow-hidden">
        {photoUrl ? (
          <OptimizedImage
            src={photoUrl || '/default-avatar.png'}
            alt={fullName}
            className="w-full h-full object-cover rounded-t-2xl"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800/80 to-gray-900/80 rounded-t-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full flex items-center justify-center border-2 border-white/20">
              <AcademicCapIcon className="h-8 w-8 text-white/80" />
            </div>
          </div>
        )}
      </div>
      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Name */}
        <h2 className="text-lg font-semibold text-white mb-1">{fullName}</h2>
        {/* Details, each on its own line */}
        {department && <p className="text-sm text-gray-300 mb-1">{department}</p>}
        {currentSemester && <p className="text-sm text-gray-300 mb-1">Semester {currentSemester}</p>}
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm text-white rounded-full font-medium border border-white/30">{tag}</span>
            ))}
          </div>
        )}
        {/* Spacer */}
        <div className="flex-grow"></div>
        {/* Footer: Socials + Button */}
        <div className="flex flex-col gap-2 mt-2">
          {(linkedinUrl || email) && (
            <div className="flex gap-2 mb-2">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/30"
                  onClick={e => e.stopPropagation()}
                >
                  <Linkedin size={18} className="text-white hover:text-primary-400" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/30"
                  onClick={e => e.stopPropagation()}
                >
                  <Mail size={18} className="text-white hover:text-primary-400" />
                </a>
              )}
            </div>
          )}
          {displayButton}
        </div>
      </div>
    </div>
  );
});

export default StudentCard; 