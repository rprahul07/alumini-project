import { Heart } from 'lucide-react';

const BookmarkFilterButton = ({ 
  showBookmarkedOnly, 
  onToggle, 
  bookmarkCount = 0,
  loading = false,
  disabled = false
}) => {
  return (
    <button
      onClick={onToggle}
      disabled={loading || disabled}
      title={showBookmarkedOnly ? `Showing bookmarked (${bookmarkCount})` : `Show bookmarked (${bookmarkCount})`}
      className={`flex items-center gap-2 px-3 py-2 font-semibold border-2 bg-white/60 backdrop-blur text-sm shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full whitespace-nowrap relative ${
        showBookmarkedOnly 
          ? 'border-indigo-400 bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
          : 'border-indigo-400 text-indigo-700 hover:bg-white/80'
      } ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart 
          size={16} 
          className={`${showBookmarkedOnly ? 'fill-red-500 text-red-500' : ''} transition-colors`} 
        />
      )}
      <span className="hidden sm:inline">
        {showBookmarkedOnly ? `Bookmarked (${bookmarkCount})` : 'Bookmarked'}
      </span>
      {!showBookmarkedOnly && bookmarkCount > 0 && (
        <span className="bg-indigo-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
          {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default BookmarkFilterButton;
