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
  profileImg,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col w-full max-w-[240px] sm:w-[240px] mx-auto my-3 sm:my-2 p-3 sm:p-0 border border-gray-100">
      {/* Centered Circle Avatar */}
      <div className="flex justify-center items-center pt-4 pb-1">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-3 border-white shadow-md">
          <img
            src={profileImg}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop';
            }}
          />
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col flex-grow px-0 sm:px-3 pt-1 pb-1">
        <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-sm md:text-base leading-tight line-clamp-1 text-center font-sans">{name}</h4>
        <div className="flex flex-wrap gap-1.5 mb-1 justify-center">
          <span className="text-xs text-gray-500 font-medium font-sans">{batch}</span>
          <span className="text-xs text-gray-400 font-medium font-sans">{department}</span>
        </div>
        <div className="font-semibold text-gray-800 text-xs mb-1 line-clamp-1 text-center font-sans">{position}</div>
        <div className="text-xs text-gray-600 mb-2 line-clamp-1 text-center font-sans">{company}</div>
        <div className="flex flex-wrap gap-0.5 mb-2 justify-center">
          {tags && tags.map((tag, i) => (
            <span
              key={i}
              className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-xs font-medium font-sans"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-between items-center w-full px-0 sm:px-3 pb-2 pt-1 mt-auto gap-1.5">
        <a
          href="#"
          className="flex items-center gap-1.5 text-[#0A66C2] font-medium text-xs hover:underline transition-colors font-sans"
        >
          <LinkedInIcon />
          Profile
        </a>
        <button className="bg-[#5A32EA] text-white px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 text-xs hover:bg-[#4321b8] transition-colors group-hover:shadow-lg font-sans">
          View Story
          <span className="font-bold text-sm transition-transform duration-300 group-hover:translate-x-1">
            <FiArrowRight className="inline-block align-middle text-sm" />
          </span>
        </button>
      </div>
    </div>
  );
} 