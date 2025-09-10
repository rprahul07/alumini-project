import React, { memo } from 'react';
import { Mail, Linkedin, Heart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const AlumniCard = memo(({
  alumni,
  onRequestMentorship,
  onCardClick,
  buttonDisabled = false,
  buttonLabel = 'Request Mentorship',
  isBookmarked = false,
  onBookmarkToggle,
  bookmarkLoading = false,
  user = null,
}) => {
  // Destructure alumni data with fallbacks
  const {
    fullName = alumni.name || 'Unknown',
    photoUrl,
    currentJobTitle,
    companyName,
    graduationYear,
    course,
    tags = [],
    linkedinUrl,
    email,
    connectionStatus,
  } = alumni || {};

  // Compose job and batch text
  const jobText = currentJobTitle && companyName
    ? `${currentJobTitle} at ${companyName}`
    : currentJobTitle || companyName || '';
  // Show batch and course as separate lines
  const batchLine = graduationYear ? `Batch: ${graduationYear}` : '';
  const courseLine = course || '';

  // Button logic for connection status
  let displayButton = null;
  
  // Hide mentorship button for admin users
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
          onRequestMentorship && onRequestMentorship(alumni);
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
            onRequestMentorship && onRequestMentorship(alumni);
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
    onCardClick && onCardClick(alumni);
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
              <span className="text-white/80 text-2xl font-bold">?</span>
            </div>
          </div>
        )}
        
        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle && onBookmarkToggle(alumni.userId);
          }}
          disabled={bookmarkLoading}
          className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all ${
            bookmarkLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {bookmarkLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart 
              size={16} 
              className={`${isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
            />
          )}
        </button>
      </div>
      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Name */}
        <h2 className="text-lg font-semibold text-white mb-1">{fullName}</h2>
        {/* Details, each on its own line */}
        {jobText && <p className="text-sm text-gray-300 mb-1">{jobText}</p>}
        {batchLine && <p className="text-sm text-gray-300 mb-1">{batchLine}</p>}
        {courseLine && <p className="text-sm text-gray-300 mb-1">{courseLine}</p>}
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

export default AlumniCard; 
 
 