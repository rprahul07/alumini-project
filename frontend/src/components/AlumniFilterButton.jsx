import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const AlumniFilterButton = ({ 
  selectedGraduationYear, 
  selectedCompany,
  selectedRole,
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate graduation years (last 30 years)
  const currentYear = new Date().getFullYear();
  const graduationYears = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    }))
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
    { value: 'graduationYear', label: 'Graduation Year (Newest)' },
    { value: 'graduationYear_asc', label: 'Graduation Year (Oldest)' },
  ];

  const handleGraduationYearChange = (e) => {
    onFilterChange('graduationYear', e.target.value);
    setIsOpen(false);
  };

  const handleCompanyChange = (e) => {
    onFilterChange('company', e.target.value);
    setIsOpen(false);
  };

  const handleRoleChange = (e) => {
    onFilterChange('role', e.target.value);
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
    if (value.includes('_')) {
      const [field, order] = value.split('_');
      onSortChange(field, order);
    } else {
      onSortChange(value, 'desc');
    }
    setIsOpen(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => {
      if (sortBy === 'createdAt' && sortOrder === 'desc') return opt.value === 'createdAt';
      if (sortBy === 'createdAt' && sortOrder === 'asc') return opt.value === 'createdAt_asc';
      if (sortBy === 'fullName' && sortOrder === 'asc') return opt.value === 'fullName';
      if (sortBy === 'fullName' && sortOrder === 'desc') return opt.value === 'fullName_desc';
      if (sortBy === 'companyName' && sortOrder === 'asc') return opt.value === 'companyName';
      if (sortBy === 'companyName' && sortOrder === 'desc') return opt.value === 'companyName_desc';
      if (sortBy === 'graduationYear' && sortOrder === 'desc') return opt.value === 'graduationYear';
      if (sortBy === 'graduationYear' && sortOrder === 'asc') return opt.value === 'graduationYear_asc';
      return false;
    });
    return option ? option.label : 'Latest First';
  };

  const getGraduationYearLabel = () => {
    const year = graduationYears.find(y => y.value === selectedGraduationYear);
    return year ? year.label : 'All Years';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 rounded-full whitespace-nowrap"
      >
        <FunnelIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-4">
            {/* Graduation Year Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Graduation Year
              </label>
              <select
                value={selectedGraduationYear}
                onChange={handleGraduationYearChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm"
              >
                {graduationYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sort By
              </label>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                      getSortLabel() === option.label
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Year: <span className="font-medium text-gray-700">{getGraduationYearLabel()}</span></div>
                <div>Sort: <span className="font-medium text-gray-700">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniFilterButton; 