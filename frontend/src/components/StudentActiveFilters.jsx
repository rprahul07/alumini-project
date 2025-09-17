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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="text-primary-600 hover:text-primary-800 transition-colors p-0.5 rounded-full hover:bg-primary-200"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedDepartment && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Department: {selectedDepartment}</span>
          <button
            onClick={() => onClearFilter('department')}
            className="text-secondary-600 hover:text-secondary-800 transition-colors p-0.5 rounded-full hover:bg-secondary-200"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedSemester && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Semester: {selectedSemester}</span>
          <button
            onClick={() => onClearFilter('semester')}
            className="text-green-600 hover:text-green-800 transition-colors p-0.5 rounded-full hover:bg-green-200"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentActiveFilters; 