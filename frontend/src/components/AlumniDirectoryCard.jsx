import React from 'react';

const AlumniDirectoryCard = ({ name, year, major, role, company, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg text-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img
        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-gray-200"
        src={imageUrl}
        alt={`Profile of ${name}`}
      />
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500">Class of {year} | {major}</p>
      <p className="text-gray-700 mt-2 font-semibold">{role}</p>
      <p className="text-gray-600">{company}</p>
      <button className="mt-4 w-full px-4 py-2 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition duration-300">
        Request Mentorship
      </button>
    </div>
  );
};

export default AlumniDirectoryCard;