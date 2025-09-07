import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ActiveFilters = ({ 
  selectedType, 
  sortBy, 
  sortOrder, 
  onClearType, 
  onClearSort 
}) => {
  const hasActiveFilters = selectedType || (sortBy !== 'createdAt' || sortOrder !== 'desc');

  if (!hasActiveFilters) return null;

  const getTypeLabel = () => {
    const types = {
      '': 'All Types',
      'job': 'Job',
      'internship': 'Internship'
    };
    return types[selectedType] || 'All Types';
  };

  const getSortLabel = () => {
    if (sortBy === 'createdAt' && sortOrder === 'desc') return 'Latest First';
    if (sortBy === 'createdAt' && sortOrder === 'asc') return 'Oldest First';
    if (sortBy === 'jobTitle' && sortOrder === 'asc') return 'Title A-Z';
    if (sortBy === 'jobTitle' && sortOrder === 'desc') return 'Title Z-A';
    if (sortBy === 'companyName' && sortOrder === 'asc') return 'Company A-Z';
    if (sortBy === 'companyName' && sortOrder === 'desc') return 'Company Z-A';
    return 'Latest First';
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {selectedType && (
        <div className="flex items-center gap-1 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          <span className="text-sm">Type: {getTypeLabel()}</span>
          <button
            onClick={onClearType}
            className="ml-1 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
            aria-label="Clear type filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
        <div className="flex items-center gap-1 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          <span className="text-sm">Sort: {getSortLabel()}</span>
          <button
            onClick={onClearSort}
            className="ml-1 hover:text-secondary-800 transition-colors p-1 rounded-full hover:bg-secondary-200"
            aria-label="Clear sort filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters; 