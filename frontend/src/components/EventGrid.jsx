import React, { useEffect, useRef, useState } from 'react';
import EventCard from './EventCard';
import { preloadEventImages } from '../utils/imagePreloader';

const EventGrid = ({ events, user, onEventUpdate }) => {
  const [visibleEvents, setVisibleEvents] = useState([]);
  const observerRef = useRef(null);

  // Preload critical event images for better perceived performance
  useEffect(() => {
    if (events && events.length > 0) {
      preloadEventImages(events, 3); // Preload first 3 event images
    }
  }, [events]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!events || events.length === 0) return;

    // Show first 3 events immediately
    setVisibleEvents(events.slice(0, 3));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleEvents(prev => {
              if (!prev.some(event => event.id === events[index].id)) {
                return [...prev, events[index]];
              }
              return prev;
            });
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );

    observerRef.current = observer;

    // Observe placeholder elements for remaining events
    events.slice(3).forEach((_, index) => {
      const placeholder = document.getElementById(`event-placeholder-${index + 3}`);
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
      {visibleEvents.map((event, index) => (
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
      
      {/* Placeholder elements for lazy loading */}
      {events.slice(visibleEvents.length).map((_, index) => (
        <div
          key={`placeholder-${index + visibleEvents.length}`}
          id={`event-placeholder-${index + visibleEvents.length}`}
          className="h-80 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
};

export default EventGrid; 