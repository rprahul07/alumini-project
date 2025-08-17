import React from 'react';

const EventCard = ({ title, date, description, imageUrl, status }) => {
  const isPast = status === 'Past';

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${isPast ? 'opacity-60' : ''}`}>
      <img src={imageUrl} className="w-full h-48 object-cover" alt={title} />
      <div className="p-6">
        <p className={`text-sm font-semibold ${isPast ? 'text-gray-500' : 'text-blue-600'}`}>{date}</p>
        <h3 className="text-xl font-bold my-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm">{description}</p>
        
        {isPast ? (
          <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 font-bold rounded-full cursor-not-allowed">
            View Details
          </button>
        ) : (
          <button className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
            Register Now
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;