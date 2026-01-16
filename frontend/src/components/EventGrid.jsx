import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import EventCard from './EventCard';
import { preloadEventImages } from '../utils/imagePreloader';

const EventGrid = ({ events, user, onEventUpdate }) => {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const observerRef = useRef(null);

  // Debug events data (removed for production performance)


  // Memoize filtered events to prevent unnecessary re-renders
  const filteredEvents = useMemo(() => {
    return events ? events.filter(event => event && event.id) : [];
  }, [events]);

  // Preload critical event images for better perceived performance
  useEffect(() => {
    if (filteredEvents.length > 0) {
      // Preload first 3 images for better LCP
      preloadEventImages(filteredEvents, 3);
    }
  }, [filteredEvents]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!filteredEvents || filteredEvents.length === 0) return;

    // Show first 10 events immediately (with safety check)
    const initialEvents = filteredEvents.slice(0, 10);
    setVisibleEvents(initialEvents);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            // Validate index is within bounds
            if (index >= 0 && index < filteredEvents.length) {
              setVisibleEvents(prev => {
                // Load 5 events at a time for faster loading
                const startIndex = Math.floor(index / 5) * 5;
                const endIndex = Math.min(startIndex + 5, filteredEvents.length);
                const eventsToAdd = filteredEvents.slice(startIndex, endIndex).filter(event =>
                  event && event.id && !prev.some(prevEvent => prevEvent && prevEvent.id === event.id)
                );
                return [...prev, ...eventsToAdd];
              });
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Increased margin for earlier loading
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    // Observe placeholder elements for remaining events (starting from index 10)
    filteredEvents.slice(10).forEach((_, index) => {
      const placeholder = document.getElementById(`event-placeholder-${index + 10}`);
      if (placeholder) {
        observer.observe(placeholder);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredEvents]);

  if (!filteredEvents || filteredEvents.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Render visible events */}
      {visibleEvents.filter(event => event && event.id).map((event, index) => (
        <div
          key={event.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <EventCard
            event={event}
            user={user}
            onEventUpdate={onEventUpdate}
          />
        </div>
      ))}

      {/* Enhanced placeholder elements for lazy loading */}
      {filteredEvents && filteredEvents.length > visibleEvents.length && filteredEvents.slice(visibleEvents.length).map((_, index) => (
        <div
          key={`placeholder-${index + visibleEvents.length}`}
          id={`event-placeholder-${index + visibleEvents.length}`}
          data-index={index + visibleEvents.length}
          className="h-80 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 animate-pulse overflow-hidden"
        >
          <div className="h-full bg-gradient-to-br from-slate-50/50 via-slate-100/50 to-slate-50/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-200/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-slate-500 text-xs font-sans">Loading more events...</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventGrid; 