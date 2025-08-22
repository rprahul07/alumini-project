import React, { useEffect } from 'react';
import EventCard from './EventCard';
import { preloadEventImages } from '../utils/imagePreloader';

const EventGrid = ({ events, user, onEventUpdate }) => {
  // Preload critical event images for better perceived performance
  useEffect(() => {
    if (events && events.length > 0) {
      preloadEventImages(events, 6); // Preload first 6 event images
    }
  }, [events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          user={user} 
          onEventUpdate={onEventUpdate}
        />
      ))}
    </div>
  );
};

export default EventGrid; 