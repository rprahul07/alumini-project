import React, { useRef, useState, useEffect } from 'react';

export default function Timeline({ milestones }) {
  const timelineRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (timelineRef.current) observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e, idx) => {
    setActiveIdx(idx);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setActiveIdx(null), 400);
  };

  const scrollToMilestone = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = window.innerWidth; // Full viewport width
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={timelineRef}
      className={`w-full flex flex-col justify-center items-center relative ${isMobile ? 'min-h-screen' : ''}`}
      style={{ 
        minHeight: isMobile ? undefined : '100vh',
        background: '#f8f0fc',
        padding: isMobile ? '1rem 0' : '0'
      }}
    >
      <h2
        className={`${isMobile ? 'text-3xl mt-4 mb-1' : 'text-2xl md:text-4xl mb-2 md:mb-4'} font-bold text-[#5A32EA] text-center`}
      >
        Our Journey
      </h2>
      <br></br>
      <p
        className={`${isMobile ? 'text-md mb-4 mt-0' : 'text-sm md:text-lg mb-4 md:mb-24'} text-gray-500 text-center px-4`}
      >
        {isMobile ? 'Swipe to walk through the milestones of our incredible journey' : 'Hover over to get a detailed glimpse of our journey this far'}
      </p>
      
      {/* Mobile Navigation Arrows */}
      {isMobile && (
        <div className="flex justify-between items-center w-full max-w-6xl px-4 mb-2">
          <button
            onClick={() => scrollToMilestone('left')}
            className="p-2 rounded-full bg-white shadow-lg text-[#5A32EA] hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollToMilestone('right')}
            className="p-2 rounded-full bg-white shadow-lg text-[#5A32EA] hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative w-full max-w-6xl flex items-center justify-center px-4">
        {/* Desktop Timeline */}
        {!isMobile && (
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
        )}

        {/* Mobile Timeline */}
        {isMobile && (
          <div 
            ref={scrollContainerRef}
            className="w-full flex-1 flex flex-col justify-center overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              height: '100%'
            }}
          >
            <div className="flex items-center min-w-max h-full relative flex-1 justify-center">
              {/* Dotted line removed for mobile */}
              {milestones.map((m, idx) => (
                <div
                  key={m.year}
                  className="flex flex-col items-center justify-center snap-center relative h-full"
                  style={{ 
                    minWidth: '100vw',
                    width: '100vw'
                  }}
                  onTouchStart={(e) => handleTouchStart(e, idx)}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Timeline Container with Compact Layout */}
                  <div className="flex flex-col items-center justify-center w-full h-full px-6 relative pt-2">
                    {/* Milestone Content Container - Compact */}
                    <div className="flex flex-col items-center justify-start w-full max-w-sm mx-auto relative z-10">
                      {/* Milestone Dot - Centered on the line, pushed up */}
                      <div className="flex items-center justify-center w-full mb-2 mt-0 relative">
                        <div
                          className={`w-10 h-10 rounded-full border-4 border-[#5A32EA] bg-white flex items-center justify-center transition-all duration-700 shadow-lg relative z-20 ${inView ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                          style={{ transitionDelay: `${idx * 200}ms` }}
                        >
                          <span className="w-3 h-3 bg-[#5A32EA] rounded-full block" />
                        </div>
                      </div>
                      {/* Year and Summary - Compact, pushed up */}
                      <div className="text-center mb-2">
                        <span className="block text-xl font-bold text-[#5A32EA] mb-0.5">{m.year}</span>
                        <span className="block text-sm text-gray-700 font-medium">{m.summary}</span>
                      </div>
                      {/* Description Card - Compact, always centered and never overflowing */}
                      <div className="w-[90vw] max-w-sm mx-auto mt-2">
                        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-4 text-gray-800 text-sm font-normal min-h-[120px] max-h-[160px] overflow-y-auto">
                          <div className="font-semibold text-[#5A32EA] mb-2 text-sm">{m.year} - {m.summary}</div>
                          <div className="text-sm leading-relaxed line-clamp-3">{m.details}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
} 