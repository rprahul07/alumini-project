import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const AlumniFilters = ({ selectedGraduationYear, onFilterChange }) => {
  // Generate last 30 years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <select
            id="graduationYear"
            value={selectedGraduationYear}
            onChange={e => onFilterChange(e.target.value)}
            className="rounded-full px-4 py-1.5 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlumniFilters; 
 
 