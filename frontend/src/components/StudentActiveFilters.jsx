import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const StudentActiveFilters = ({ 
  searchTerm, 
  selectedDepartment, 
  selectedSemester,
  onClearSearch, 
  onClearFilter 
}) => {
  const hasActiveFilters = searchTerm || selectedDepartment || selectedSemester;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-6">
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
      
      {selectedDepartment && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Department: {selectedDepartment}</span>
          <button
            onClick={() => onClearFilter('department')}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedSemester && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Semester: {selectedSemester}</span>
          <button
            onClick={() => onClearFilter('semester')}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentActiveFilters; 