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
    <div className="flex flex-wrap gap-2 mb-4">
      {searchTerm && (
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          <span>Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedDepartment && (
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          <span>Department: {selectedDepartment}</span>
          <button
            onClick={() => onClearFilter('department')}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedSemester && (
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          <span>Semester: {selectedSemester}</span>
          <button
            onClick={() => onClearFilter('semester')}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentActiveFilters; 