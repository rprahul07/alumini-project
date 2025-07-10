import React, { useState, useRef, useEffect } from 'react';

function useInView(ref) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isInView;
}

export default function JourneyCard() {
  const milestones = [
    { year: '1965', text: 'CUCEK was established with a vision to provide quality education and shape future leaders.' },
    { year: '1980', text: 'Expanded our academic programs and established international partnerships.' },
    { year: '1995', text: 'Launched innovative research initiatives and state-of-the-art facilities.' },
    { year: '2005', text: 'Introduced online learning platforms and distance education programs.' },
    { year: '2015', text: 'Launched Alumni Connect to foster stronger connections between graduates and the institution.' },
    { year: '2020', text: 'Expanded global reach with international campuses and virtual learning environments.' },
  ];

  const [activeIdx, setActiveIdx] = useState(null);
  const [isTimelineInView, setIsTimelineInView] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTimelineInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-gray-100">
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(90,50,234,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(90,50,234,0.12); }
        }
      `}</style>
      <div className="flex items-center mb-8">
        <span className="inline-block w-2 h-6 rounded bg-[#5A32EA] mr-3" />
        <h3 className="text-xl font-semibold text-gray-900 tracking-wide">Our Journey</h3>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div
          className={`absolute left-3 top-2 border-l-2 border-dashed border-purple-200 transition-all duration-1000 ease-in-out ${
            isTimelineInView ? 'h-full' : 'h-0'
          }`}
          aria-hidden="true"
        />
        <ul className="space-y-6" ref={timelineRef}>
          {milestones.map((m, idx) => (
            <li
              key={m.year}
              className={`relative pl-10 group cursor-pointer select-none transition-all duration-700
                ${isTimelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              onTouchStart={() => setActiveIdx(idx)}
              onTouchEnd={() => setTimeout(() => setActiveIdx(null), 400)}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{ transitionDelay: `${150 + idx * 100}ms` }}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1 w-6 h-6 bg-white border-4 rounded-full transition-all duration-200
                  border-[#5A32EA]
                  group-hover:scale-125 group-hover:bg-[#ede9fe]
                  ${activeIdx === idx ? 'scale-125 bg-[#ede9fe]' : ''}
                `}
                style={
                  activeIdx === idx
                    ? { animation: 'pulse-dot 1.2s infinite' }
                    : {}
                }
                aria-hidden="true"
              />
              {/* Year */}
              <span
                className={`font-bold transition-colors duration-200 text-lg
                  ${activeIdx === idx ? 'text-purple-700' : 'text-[#5A32EA]'}
                  group-hover:text-purple-700
                `}
              >
                {m.year}
              </span>
              {/* Description */}
              <p className="mt-2 text-base text-gray-700 leading-relaxed">
                {m.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 