import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const TestimonialFilterButton = ({ 
  filterDepartment, 
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange,
  departments = []
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

  // Sort options for testimonials
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
  ];

  const handleDepartmentChange = (e) => {
    onFilterChange('department', e.target.value);
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split('_');
    onSortChange(field, order);
    setIsOpen(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === `${sortBy}_${sortOrder}`);
    return option ? option.label : 'Latest First';
  };

  const getDepartmentLabel = () => {
    return filterDepartment || 'All Departments';
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
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={handleDepartmentChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
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
                <div>Department: <span className="font-medium text-gray-700">{getDepartmentLabel()}</span></div>
                <div>Sort: <span className="font-medium text-gray-700">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialFilterButton;
