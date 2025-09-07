import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const EventActiveFilters = ({ 
  searchTerm, 
  selectedEventType, 
  onClearSearch, 
  onClearFilter 
}) => {
  const hasActiveFilters = searchTerm || selectedEventType;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {searchTerm && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedEventType && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Type: {selectedEventType}</span>
          <button
            onClick={() => onClearFilter('eventType')}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventActiveFilters; 