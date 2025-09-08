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
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 font-semibold bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-primary-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 rounded-2xl whitespace-nowrap group w-full xl:w-auto font-body text-base"
      >
        <FunnelIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-72 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 z-[99999] max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
            {/* Event Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Event Type
              </label>
              <select
                value={selectedEventType}
                onChange={handleEventTypeChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-white text-sm font-body"
              >
                {eventTypeOptions.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Event Time
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('all')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-300 font-body ${
                    timeFilter === 'all' 
                      ? 'bg-primary-500/20 text-primary-300 font-semibold border-primary-400/50' 
                      : 'text-white/80 border-white/30 hover:bg-white/10 hover:border-white/50'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('upcoming')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-300 font-body ${
                    timeFilter === 'upcoming' 
                      ? 'bg-secondary-500/20 text-secondary-300 font-semibold border-secondary-400/50' 
                      : 'text-white/80 border-white/30 hover:bg-white/10 hover:border-white/50'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => onTimeFilterChange && onTimeFilterChange('past')}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all duration-300 font-body ${
                    timeFilter === 'past' 
                      ? 'bg-accent-500/20 text-accent-300 font-semibold border-accent-400/50' 
                      : 'text-white/80 border-white/30 hover:bg-white/10 hover:border-white/50'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Sort By
              </label>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-body ${
                      getSortLabel() === option.label
                        ? 'bg-primary-500/20 text-primary-300 font-semibold border border-primary-400/50'
                        : 'text-white/80 hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="pt-4 border-t border-white/20">
              <div className="text-xs text-white/70 space-y-2 font-body">
                <div>Type: <span className="font-semibold text-white/90">{getEventTypeLabel()}</span></div>
                <div>Sort: <span className="font-semibold text-white/90">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilterButton; 