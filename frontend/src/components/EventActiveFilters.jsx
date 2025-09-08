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
        <div className="flex items-center gap-3 px-4 py-2 bg-primary-500/20 backdrop-blur-xl text-primary-300 rounded-full text-sm font-semibold shadow-xl border border-primary-400/30 animate-fade-in font-body">
          <span>Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="text-primary-400 hover:text-primary-200 transition-colors p-1 rounded-full hover:bg-primary-500/20"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedEventType && (
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary-500/20 backdrop-blur-xl text-secondary-300 rounded-full text-sm font-semibold shadow-xl border border-secondary-400/30 animate-fade-in font-body">
          <span>Type: {selectedEventType}</span>
          <button
            onClick={() => onClearFilter('eventType')}
            className="text-secondary-400 hover:text-secondary-200 transition-colors p-1 rounded-full hover:bg-secondary-500/20"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventActiveFilters; 