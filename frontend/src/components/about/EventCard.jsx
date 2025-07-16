import React from 'react';

const FacebookIcon = () => (
  <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.14 9.5 5.32v2.14H6.1v4.13h3.4v8.2h4.13v-8.2h3.4l.5-4.13z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.995 4.995 0 002.163-2.723c-.951.564-2.005.975-3.127 1.195a4.99 4.99 0 00-8.5 4.546A14.08 14.08 0 011.022 3.86a4.99 4.99 0 001.524 6.674 4.99 4.99 0 01-2.26-.628v.063a4.99 4.99 0 004.008 4.885 4.99 4.99 0 01-2.25.085 4.99 4.99 0 004.668 3.46A9.99 9.99 0 010 19.54a14.04 14.04 0 007.618 2.24c9.14 0 14.122-7.56 14.122-14.122 0-.214-.005-.428-.014-.64a10.03 10.03 0 002.488-2.55z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function EventCard({ title, imgSrc }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-full w-full min-h-[140px] max-h-[160px] sm:min-h-[180px] sm:max-h-[200px] md:min-h-[220px] md:max-h-[240px] shadow-lg group hover:shadow-2xl transition-all duration-300">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Social media icons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <a
          href="#"
          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg hover:shadow-xl"
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
        </a>
        <a
          href="#"
          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg hover:shadow-xl"
          aria-label="Share on Twitter"
        >
          <TwitterIcon />
        </a>
        <a
          href="#"
          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-lg hover:shadow-xl"
          aria-label="Share on LinkedIn"
        >
          <LinkedInIcon />
        </a>
      </div>
      {/* Event title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-base font-semibold leading-tight group-hover:text-lg transition-all duration-300">
          {title}
        </h3>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#5A32EA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
} 