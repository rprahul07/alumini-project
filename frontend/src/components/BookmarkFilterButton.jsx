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
      className={`flex items-center justify-center p-2 rounded-lg transition-colors relative ${
        showBookmarkedOnly 
          ? 'bg-red-50 border-red-200 text-red-700' 
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart 
        size={20} 
        className={`${showBookmarkedOnly ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} 
      />
      {bookmarkCount > 0 && (
        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold rounded-full ${
          showBookmarkedOnly 
            ? 'bg-red-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {bookmarkCount > 99 ? '99+' : bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default BookmarkFilterButton;
