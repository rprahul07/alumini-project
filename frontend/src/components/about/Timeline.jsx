import React, { useRef, useState, useEffect } from 'react';

export default function Timeline({ milestones }) {
  const timelineRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (timelineRef.current) observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={timelineRef}
      className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-x-auto"
      style={{ minHeight: '100vh', background: '#f8f0fc' }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[#5A32EA] mb-4 text-center">Our Journey</h2>
      <p className="text-base md:text-lg text-gray-500 mb-24 text-center">Hover over to get a detailed glimpse of our journey this far</p>
      <div className="relative w-full max-w-6xl flex items-center justify-center px-4">
        {/* Timeline Milestones and Segments */}
        <div className="w-full flex items-center relative z-10">
          {milestones.map((m, idx) => (
            <React.Fragment key={m.year}>
              {/* Dotted Line Segment BEFORE the circle (except for the first) */}
              {idx > 0 && (
                <div
                  className="h-1 border-t-2 border-dotted border-[#5A32EA] bg-transparent"
                  style={{
                    width: inView ? 80 : 0,
                    minWidth: 40,
                    marginLeft: 0,
                    marginRight: 0,
                    transition: `width 1s cubic-bezier(0.4,0,0.2,1)`,
                    transitionDelay: inView ? `${400 + (idx - 1) * 350}ms` : '0ms',
                    alignSelf: 'center',
                  }}
                />
              )}
              {/* Milestone Dot */}
              <div
                className="flex flex-col items-center group cursor-pointer relative"
                style={{ flex: 1, zIndex: 2 }}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onTouchStart={() => setActiveIdx(idx)}
                onTouchEnd={() => setTimeout(() => setActiveIdx(null), 400)}
              >
                <div className="flex items-center justify-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-[#5A32EA] bg-white flex items-center justify-center transition-all duration-700 ${inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                    style={{ transitionDelay: `${idx * 200}ms` }}
                  >
                    <span className="w-3 h-3 bg-[#5A32EA] rounded-full block" />
                  </div>
                </div>
                <span className="mt-3 text-lg font-bold text-[#5A32EA]">{m.year}</span>
                <span className="mt-1 text-sm text-gray-700 font-medium">{m.summary}</span>
                {activeIdx === idx && (
                  <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-20 animate-fade-in text-gray-800 text-sm font-normal">
                    <div className="font-semibold text-[#5A32EA] mb-2">{m.year} - {m.summary}</div>
                    <div>{m.details}</div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
} 