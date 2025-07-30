import React from 'react';
import { Heart } from 'lucide-react';

const BookmarkFilterButton = ({ showBookmarked, onToggle, bookmarkCount = 0 }) => {
  return (
    <button
      onClick={onToggle}
    >
      <Heart 
        size={20} 
        className={`${showBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
      />
     
      {bookmarkCount > 0 && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          showBookmarked ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-600'
        }`}>
          {bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default BookmarkFilterButton;
