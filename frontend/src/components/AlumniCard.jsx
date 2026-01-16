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
  const batchLine = graduationYear ? `Batch of ${graduationYear}` : '';
  const courseLine = course || '';

  // Button logic for connection status
  let displayButton = null;

  // Hide mentorship button for admin users
  if (user && user.role === 'admin') {
    displayButton = null;
  } else if (buttonLabel === "You can't send yourself") {
    displayButton = (
      <button
        className="rounded-lg px-4 py-2 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-slate-100 text-slate-400 cursor-not-allowed font-sans border border-slate-200"
        disabled
        onClick={e => e.stopPropagation()}
      >
        {buttonLabel}
      </button>
    );
  } else if (connectionStatus === 'accepted') {
    displayButton = (
      <button
        className="rounded-lg px-4 py-2 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-green-50 text-green-700 border border-green-200 cursor-default font-sans"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Connected
      </button>
    );
  } else if (connectionStatus === 'pending') {
    displayButton = (
      <button
        className="rounded-lg px-4 py-2 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-yellow-50 text-yellow-700 border border-yellow-200 cursor-not-allowed font-sans"
        disabled
        onClick={e => e.stopPropagation()}
      >
        Pending
      </button>
    );
  } else if (connectionStatus === 'rejected') {
    displayButton = (
      <button
        className="rounded-lg px-4 py-2 font-semibold w-full text-xs flex items-center justify-center transition-colors bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-sans"
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
        className="rounded-lg px-4 py-2 font-semibold w-full text-xs flex items-center justify-center transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md font-sans"
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
      className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 z-10 overflow-hidden group min-h-[420px]"
      onClick={handleCardClick}
    >
      {/* Image at the top - Increased height */}
      <div className="relative h-48 bg-slate-100 flex-shrink-0 w-full overflow-hidden">
        {photoUrl ? (
          <OptimizedImage
            src={photoUrl || '/default-avatar.png'}
            alt={fullName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
              <span className="text-slate-400 text-2xl font-bold font-sans">
                {fullName.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle && onBookmarkToggle(alumni.userId);
          }}
          disabled={bookmarkLoading}
          className={`absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all ${bookmarkLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
          {bookmarkLoading ? (
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart
              size={16}
              className={`${isBookmarked ? 'text-red-500 fill-red-500' : 'text-slate-600'} transition-colors`}
            />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name & Role */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 mb-1 font-sans line-clamp-1 group-hover:text-primary-600 transition-colors">
            {fullName}
          </h2>
          {jobText && (
            <p className="text-sm text-slate-600 font-medium font-sans line-clamp-2 min-h-[2.5em]">
              {jobText}
            </p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1 mb-4 text-xs text-slate-500 font-sans">
          {batchLine && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>{batchLine}</div>}
          {courseLine && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>{courseLine}</div>}
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-6 flex-1 content-start">
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-[10px] uppercase tracking-wider bg-slate-50 text-slate-600 rounded-lg font-semibold border border-slate-200 font-sans">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2.5 py-1 text-[10px] bg-slate-50 text-slate-500 rounded-lg font-semibold border border-slate-200 font-sans">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer: Socials + Button */}
        <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {(linkedinUrl || email) ? (
              <>
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 rounded-lg hover:bg-white hover:shadow-md transition-all border border-slate-200 text-slate-500 hover:text-[#0077b5]"
                    onClick={e => e.stopPropagation()}
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="p-2 bg-slate-50 rounded-lg hover:bg-white hover:shadow-md transition-all border border-slate-200 text-slate-500 hover:text-red-500"
                    onClick={e => e.stopPropagation()}
                  >
                    <Mail size={16} />
                  </a>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-400 italic">No socials</span>
            )}
          </div>
          <div className="flex-1">
            {displayButton}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AlumniCard;

