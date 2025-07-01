import React from 'react';
import EventCard from './EventCard';

const EventGrid = ({ events, user, onEventUpdate }) => {
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