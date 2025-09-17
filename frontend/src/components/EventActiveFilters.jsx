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
    <div className="flex flex-wrap gap-3 mb-6">
      {searchTerm && (
        <div className="flex items-center gap-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          <span className="text-sm">Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="ml-1 hover:text-primary-800 transition-colors p-1 rounded-full hover:bg-primary-200"
            aria-label="Clear search filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedEventType && (
        <div className="flex items-center gap-1 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          <span className="text-sm">Type: {selectedEventType}</span>
          <button
            onClick={() => onClearFilter('eventType')}
            className="ml-1 hover:text-secondary-800 transition-colors p-1 rounded-full hover:bg-secondary-200"
            aria-label="Clear type filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventActiveFilters; 