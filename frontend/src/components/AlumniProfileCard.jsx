import React from 'react';

const AlumniProfileCard = ({ name, year, role, imageUrl }) => {
  return (
    <div className="flex-shrink-0 w-64 m-4 bg-white rounded-lg shadow-lg text-center p-6">
      <img
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        src={imageUrl}
        alt={`Profile of ${name}`}
      />
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500">Class of {year}</p>
      <p className="text-gray-700 mt-2">{role}</p>
    </div>
  );
};

export default AlumniProfileCard;