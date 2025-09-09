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
      className={`flex items-center gap-1.5 px-3 py-2 font-semibold border border-white/30 bg-white/10 backdrop-blur-sm text-sm text-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 rounded-lg whitespace-nowrap relative ${
        showBookmarkedOnly 
          ? 'bg-primary-500/20 border-primary-400/50 text-primary-300 hover:bg-primary-500/30' 
          : 'hover:bg-white/20 hover:border-white/50'
      } ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart 
          size={14} 
          className={`${showBookmarkedOnly ? 'fill-red-400 text-red-400' : 'text-white'} transition-colors`} 
        />
      )}
      <span className="text-xs">
        {showBookmarkedOnly ? `Bookmarked` : 'Bookmarks'}
      </span>
      {bookmarkCount > 0 && (
        <span className={`text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center ${
          showBookmarkedOnly 
            ? 'bg-red-500/20 text-red-300' 
            : 'bg-white/20 text-white'
        }`}>
          {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default BookmarkFilterButton;
