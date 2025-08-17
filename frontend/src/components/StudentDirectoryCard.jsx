import React from 'react';

const StudentDirectoryCard = ({ name, gradYear, major, skills, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg text-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img
        className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-blue-200"
        src={imageUrl}
        alt={`Profile of ${name}`}
      />
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-gray-500">Class of {gradYear}</p>
      <p className="text-gray-700 mt-2 font-semibold">{major}</p>
      
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
        View Profile
      </button>
    </div>
  );
};

export default StudentDirectoryCard;