import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { EVENT_TYPES } from '../constants/eventTypes';

const EventFilterButton = ({ 
  selectedEventType, 
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange, 
  timeFilter = 'all',
  onTimeFilterChange,
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

  // Use shared event types for dropdown
  const eventTypeOptions = EVENT_TYPES;

  // Only the required sort options
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
    { value: 'date_asc', label: 'Date (Earliest)' },
    { value: 'date_desc', label: 'Date (Latest)' }
  ];

  const handleEventTypeChange = (e) => {
    onFilterChange('eventType', e.target.value);
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

  const getEventTypeLabel = () => {
    const type = eventTypeOptions.find(t => t.value === selectedEventType);
    return type ? type.label : 'All Types';
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
            {/* Event Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Event Type
              </label>
              <select
                value={selectedEventType}
                onChange={handleEventTypeChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm"
              >
                {eventTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Event Time
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('all')}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${timeFilter === 'all' ? 'bg-indigo-100 text-indigo-700 font-medium border-indigo-400' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('upcoming')}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${timeFilter === 'upcoming' ? 'bg-indigo-100 text-indigo-700 font-medium border-indigo-400' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('past')}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${timeFilter === 'past' ? 'bg-indigo-100 text-indigo-700 font-medium border-indigo-400' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Past
                </button>
              </div>
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
                <div>Type: <span className="font-medium text-gray-700">{getEventTypeLabel()}</span></div>
                <div>Sort: <span className="font-medium text-gray-700">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilterButton; 