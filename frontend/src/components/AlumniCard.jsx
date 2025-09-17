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
        className="rounded-full px-3 py-1 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-gray-200 text-gray-400 cursor-not-allowed font-sans"
        disabled
        onClick={e => e.stopPropagation()}
      >
        {buttonLabel}
      </button>
    );
  } else if (connectionStatus === 'accepted') {
    displayButton = (
      <button
        className="rounded-full px-3 py-1 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-green-600 text-white hover:bg-green-700 cursor-default font-sans"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Connected
      </button>
    );
  } else if (connectionStatus === 'pending') {
    displayButton = (
      <button
        className="rounded-full px-3 py-1 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-gray-100 text-gray-500 cursor-not-allowed font-sans"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Pending
      </button>
    );
  } else if (connectionStatus === 'rejected') {
    displayButton = (
      <button
        className="rounded-full px-3 py-1 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-red-500 text-white hover:bg-red-600 font-sans"
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
        className="rounded-full px-3 py-1.5 font-semibold w-full text-xs flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:scale-105 font-sans"
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
      className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-xl w-full max-w-sm flex flex-col h-full cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-105 z-10 border border-slate-200 hover:border-slate-300"
      onClick={handleCardClick}
    >
      {/* Image at the top */}
      <div className="relative h-28 bg-gray-200 flex-shrink-0 w-full rounded-t-xl overflow-hidden">
        {photoUrl ? (
          <OptimizedImage
            src={photoUrl || '/default-avatar.png'}
            alt={fullName}
            className="w-full h-full object-cover rounded-t-xl"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center border-2 border-slate-300">
              <span className="text-slate-600 text-lg font-bold font-sans">?</span>
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
          className={`absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all ${
            bookmarkLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {bookmarkLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart 
              size={14} 
              className={`${isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
            />
          )}
        </button>
      </div>
      {/* Main Content */}
      <div className="flex flex-col flex-grow p-3">
        {/* Name */}
        <h2 className="text-base font-semibold text-slate-900 mb-1 font-sans">{fullName}</h2>
        {/* Details, each on its own line */}
        {jobText && <p className="text-xs text-slate-600 mb-1 font-sans">{jobText}</p>}
        {batchLine && <p className="text-xs text-slate-600 mb-1 font-sans">{batchLine}</p>}
        {courseLine && <p className="text-xs text-slate-600 mb-1 font-sans">{courseLine}</p>}
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs bg-slate-100 backdrop-blur-sm text-slate-700 rounded-full font-medium border border-slate-200 font-sans">{tag}</span>
            ))}
          </div>
        )}
        {/* Spacer */}
        <div className="flex-grow"></div>
        {/* Footer: Socials + Button */}
        <div className="flex flex-col gap-1.5 mt-2">
          {(linkedinUrl || email) && (
            <div className="flex gap-1.5 mb-1.5">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-slate-100 backdrop-blur-sm rounded-full hover:bg-slate-200 transition-colors border border-slate-200"
                  onClick={e => e.stopPropagation()}
                >
                  <Linkedin size={14} className="text-slate-600 hover:text-primary-500" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-1.5 bg-slate-100 backdrop-blur-sm rounded-full hover:bg-slate-200 transition-colors border border-slate-200"
                  onClick={e => e.stopPropagation()}
                >
                  <Mail size={14} className="text-slate-600 hover:text-primary-500" />
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
 
 