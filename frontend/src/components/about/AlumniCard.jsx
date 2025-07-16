import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-[#0A66C2]"
  >
    <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46C0 23.21.79 24 1.77 24h20.46c.98 0 1.77-.79 1.77-1.77V1.77C24 .79 23.21 0 22.23 0zM7.06 20.44H3.53V9h3.53v11.44zM5.3 7.5c-1.11 0-2-.9-2-2s.89-2 2-2 2 .9 2 2-.89 2-2 2zm15.14 12.94h-3.52V14.8c0-.85-.02-1.94-.9-1.94s-1.04.9-1.04 1.88v5.7h-3.52V9h3.38v1.54h.05c.47-.88 1.62-1.8 3.33-1.8 3.56 0 4.22 2.34 4.22 5.38v6.32z" />
  </svg>
);

export default function AlumniCard({
  name,
  batch,
  department,
  position,
  company,
  tags,
  story,
  profileImg,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full w-full mx-auto border-2 border-[#5A32EA] group">
      {/* Centered content */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-full border-4 border-[#5A32EA] overflow-hidden mx-auto flex-shrink-0 mb-4 group-hover:border-[#5A32EA]/80 transition-colors duration-300">
          <img 
            src={profileImg} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop';
            }}
          />
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-bold text-gray-900 mb-1">{name}</h4>
          <p className="text-sm text-gray-500 mb-1">{batch}</p>
          <p className="text-sm text-gray-500">{department}</p>
        </div>
        <div className="mb-4">
          <p className="font-semibold text-gray-800 text-sm mb-1">{position}</p>
          <p className="text-sm text-gray-600">{company}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Story section */}
      <div className="flex-grow text-left text-sm text-gray-600 leading-relaxed mb-4 pr-2">
        <p className="line-clamp-3">{story}</p>
      </div>
      {/* Footer */}
      <div className="flex justify-between items-center w-full pt-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center gap-2 text-[#0A66C2] font-medium text-sm hover:underline transition-colors"
        >
          <LinkedInIcon />
          Profile
        </a>
        <button className="bg-[#5A32EA] text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 text-sm hover:bg-[#4321b8] transition-colors group-hover:shadow-lg">
          View Story
          <span className="font-bold text-lg transition-transform duration-300 group-hover:translate-x-1">
            <FiArrowRight className="inline-block align-middle text-xl" />
          </span>
        </button>
      </div>
    </div>
  );
} 