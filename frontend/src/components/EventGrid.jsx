import React, { useEffect, useRef, useState } from 'react';
import EventCard from './EventCard';
import { preloadEventImages } from '../utils/imagePreloader';

const EventGrid = ({ events, user, onEventUpdate }) => {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const observerRef = useRef(null);

  // Debug events data
  console.log('EventGrid events:', events);
  console.log('First event imageUrl:', events?.[0]?.imageUrl);


  // Preload critical event images for better perceived performance
  useEffect(() => {
    if (events && events.length > 0) {
      preloadEventImages(events, 10); // Preload first 10 event images
    }
  }, [events]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!events || events.length === 0) return;

    // Show first 10 events immediately (with safety check)
    const initialEvents = events.slice(0, 10).filter(event => event && event.id);
    setVisibleEvents(initialEvents);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            // Validate index is within bounds
            if (index >= 0 && index < events.length) {
              setVisibleEvents(prev => {
                // Load 5 events at a time for faster loading
                const startIndex = Math.floor(index / 5) * 5;
                const endIndex = Math.min(startIndex + 5, events.length);
                const eventsToAdd = events.slice(startIndex, endIndex).filter(event => 
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
    events.slice(10).forEach((_, index) => {
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
  }, [events]);

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
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
      {events && events.length > visibleEvents.length && events.slice(visibleEvents.length).map((_, index) => (
        <div
          key={`placeholder-${index + visibleEvents.length}`}
          id={`event-placeholder-${index + visibleEvents.length}`}
          data-index={index + visibleEvents.length}
          className="h-80 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 animate-pulse overflow-hidden"
        >
          <div className="h-full bg-gradient-to-br from-white/5 via-white/10 to-white/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-white/40 text-sm font-body">Loading more events...</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventGrid; 