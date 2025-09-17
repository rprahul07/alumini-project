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
      className={`flex items-center gap-1.5 px-3 py-2 font-semibold border border-slate-200 bg-white/80 backdrop-blur-sm text-sm text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-full whitespace-nowrap relative ${
        showBookmarkedOnly 
          ? 'bg-primary-100 border-primary-300 text-primary-700 hover:bg-primary-200' 
          : 'hover:bg-slate-100 hover:border-slate-300'
      } ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart 
          size={14} 
          className={`${showBookmarkedOnly ? 'fill-red-500 text-red-500' : 'text-slate-600'} transition-colors`} 
        />
      )}
      <span className="text-xs">
        {showBookmarkedOnly ? `Bookmarked` : 'Bookmarks'}
      </span>
      {bookmarkCount > 0 && (
        <span className={`text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center ${
          showBookmarkedOnly 
            ? 'bg-red-100 text-red-600' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default BookmarkFilterButton;
