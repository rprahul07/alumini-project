import React, { useState, useRef, useEffect } from 'react';
import Timeline from '../components/about/Timeline';
import AlumniCard from '../components/about/AlumniCard';
import EventCard from '../components/about/EventCard';
import Navbar from '../components/Navbar';
import { FaArrowUp, FaChevronDown } from 'react-icons/fa';
import heroBg from '../assets/Thirike.jpg';

// Custom hook for fade in only on scroll
function useInViewFade(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function AboutUsPage() {
  // Scroll to top on reload/mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const alumniData = [
    {
      name: 'Arya Rajeev',
      batch: '2015 – 2019',
      department: 'IT',
      position: 'Senior Software Engineer',
      company: 'Microsoft',
      tags: ['#AI', '#Tech'],
      story: "Arya transitioned from CUCEK to Microsoft's AI division, becoming a voice for women in tech.",
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Riya Sharma',
      batch: '2016 – 2020',
      department: 'Electronics',
      position: 'Product Manager',
      company: 'Google',
      tags: ['#Product', '#Startup'],
      story: 'Riya started her career at a startup before being headhunted by Google. She now manages a team.',
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Vikram Patel',
      batch: '2014 – 2018',
      department: 'Computer Science',
      position: 'CEO & Founder',
      company: 'TechNova Solutions',
      tags: ['#Startup', '#Innovation'],
      story: 'Vikram founded TechNova Solutions right after graduation, now valued over $50M.',
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Meera Singh',
      batch: '2014 – 2018',
      department: 'Electrical Engineering',
      position: 'Research Scientist',
      company: 'IBM',
      tags: ['#AI', '#Research'],
      story: 'Meera is at the forefront of AI research, developing cutting-edge models at IBM.',
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Akash Verma',
      batch: '2013 – 2017',
      department: 'Information Technology',
      position: 'Cybersecurity Expert',
      company: 'Deloitte',
      tags: ['#Security', '#Consulting'],
      story: "Akash leads Deloitte's digital defense initiatives, protecting clients from cyber threats.",
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Sophia Khan',
      batch: '2018 – 2022',
      department: 'Computer Science',
      position: 'AI Research Lead',
      company: 'Amazon',
      tags: ['#AI', '#Research'],
      story: "Sophia is pioneering new approaches to ethical AI development at Amazon's research lab.",
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Arjun Mehta',
      batch: '2012 – 2016',
      department: 'Electronics',
      position: 'Hardware Engineer',
      company: 'Apple',
      tags: ['#Hardware', '#Innovation'],
      story: "Arjun is part of Apple's next-generation chip development team. His work is power-efficient.",
      profileImg: 'https://lnk.ink/l7hv3',
    },
    {
      name: 'Priya Joshi',
      batch: '2011 – 2015',
      department: 'Information Technology',
      position: 'Data Scientist',
      company: 'Salesforce',
      tags: ['#Data', '#AI'],
      story: "Priya leads Amazon's predictive analytics team, developing algorithms that drive key business decisions.",
      profileImg: 'https://lnk.ink/l7hv3',
    },
  ];

  const allEvents = [
    {
      title: 'Annual Alumni Leadership Conference',
      imgSrc: 'https://lnk.ink/x6CVH',
      category: 'Conferences',
      span: 'col-span-1 row-span-1 aspect-square',
    },
    {
      title: 'Industry Networking Mixer',
      imgSrc: 'https://cusat.ac.in/images/campus/campus.jpg',
      category: 'Networking',
      span: 'col-span-1 row-span-1 aspect-square',
    },
    {
      title: 'Career Development Workshop',
      imgSrc: 'https://lnk.ink/x6CVH',
      category: 'Workshops',
      span: 'col-span-1 row-span-1 aspect-square',
    },
    {
      title: 'Alumni Gala Dinner',
      imgSrc: 'https://cusat.ac.in/images/campus/campus.jpg',
      category: 'Social Events',
      span: 'col-span-2 md:col-span-3 row-span-1 aspect-[4/1]',
    },
    {
      title: 'International Research Symposium',
      imgSrc: 'https://lnk.ink/x6CVH',
      category: 'Conferences',
      span: 'col-span-2 md:col-span-3 row-span-1 aspect-[4/1]',
    },
    {
      title: 'Entrepreneurship Bootcamp',
      imgSrc: 'https://cusat.ac.in/images/campus/campus.jpg',
      category: 'Workshops',
      span: 'col-span-2 md:col-span-3 row-span-1 aspect-[4/1]',
    },
  ];

  const [activeCategory, setActiveCategory] = useState('All Events');
  const eventCategories = ['All Events', 'Conferences', 'Networking', 'Workshops', 'Social Events'];
  const filteredEvents = activeCategory === 'All Events' ? allEvents : allEvents.filter((event) => event.category === activeCategory);

  // Milestones for Timeline (from previous JourneyCard)
  const journeyMilestones = [
    { year: '1965', summary: 'Founded', details: 'CUCEK was established with a vision to provide quality education and shape future leaders.' },
    { year: '1980', summary: 'Expansion', details: 'Expanded our academic programs and established international partnerships.' },
    { year: '1995', summary: 'Innovation', details: 'Launched innovative research initiatives and state-of-the-art facilities.' },
    { year: '2005', summary: 'Online Learning', details: 'Introduced online learning platforms and distance education programs.' },
    { year: '2015', summary: 'Alumni Connect', details: 'Launched Alumni Connect to foster stronger connections between graduates and the institution.' },
    { year: '2020', summary: 'Global Reach', details: 'Expanded global reach with international campuses and virtual learning environments.' },
  ];

  // Fade-in for JourneyCard (now using hook)
  const [heroRef, heroVisible] = useInViewFade(0.2);
  const [journeyRef, journeyVisible] = useInViewFade(0.2);
  const [alumniRef, alumniVisible] = useInViewFade(0.15);
  const [eventsRef, eventsVisible] = useInViewFade(0.15);

  // Scroll to timeline section when arrow is clicked
  const handleHeroArrowClick = () => {
    if (journeyRef && journeyRef.current) {
      journeyRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll-to-top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [showAllAlumni, setShowAllAlumni] = useState(false);
  const alumniSectionRef = useRef(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const eventsSectionRef = useRef(null);

  return (
    <>
      <Navbar />
      {/* Hero Section - Full viewport with background image and overlay */}
      <section
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="relative w-full"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6" style={{textShadow: '0 2px 16px rgba(0,0,0,0.7)'}}>Alumni Connect</h1>
          <p className="text-lg md:text-2xl text-white font-medium max-w-2xl mx-auto drop-shadow-md" style={{textShadow: '0 1px 8px rgba(0,0,0,0.6)'}}>
            Join our growing network of successful graduates and build meaningful connections, share experiences, and explore opportunities together.
              </p>
            </div>
        {/* Scroll Down Indicator */}
        <button
          onClick={handleHeroArrowClick}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce bg-transparent border-none outline-none cursor-pointer"
          aria-label="Scroll to next section"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        </section>
      {/* Timeline Section - Our Journey */}
      <section ref={journeyRef} className={`flex transition-all duration-1000 ease-out ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <Timeline milestones={journeyMilestones} />
      </section>
      {/* Main Content (rest of About page) */}
        <div className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
            {/* Section 2: Alumni Success Stories */}
            <section ref={el => { alumniRef.current = el; alumniSectionRef.current = el; }} className={`text-center transition-all duration-1000 ease-out
              ${alumniVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#5A32EA] mb-4 relative inline-block">
                Alumni Success Stories
              </h2>
              <p className="text-base md:text-lg text-gray-600 mt-4 mb-12 max-w-3xl mx-auto">
                Discover how CUCEK alumni are making an impact across the globe.
              </p>
              <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch mb-10">
                  {(showAllAlumni ? alumniData : alumniData.slice(0, 4)).map((alum, idx) => (
                  <AlumniCard key={idx} {...alum} />
                ))}
                </div>
              </div>
              {alumniData.length > 4 && !showAllAlumni && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllAlumni(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#5A32EA] text-[#5A32EA] shadow hover:bg-[#f3e8ff] transition-colors"
                    aria-label="Show more alumni"
                  >
                    <FaChevronDown className="w-6 h-6" />
                  </button>
                </div>
              )}
              {alumniData.length > 4 && showAllAlumni && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setShowAllAlumni(false);
                      setTimeout(() => {
                        if (alumniSectionRef.current) {
                          alumniSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 50);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#5A32EA] text-[#5A32EA] shadow hover:bg-[#f3e8ff] transition-colors"
                    aria-label="Collapse alumni list"
                  >
                    <FaChevronDown className="w-6 h-6 rotate-180" />
                  </button>
                </div>
              )}
            </section>
            {/* Section 3: Events & Activities */}
            <section ref={el => { eventsRef.current = el; eventsSectionRef.current = el; }} className={`text-center transition-all duration-1000 ease-out
              ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#5A32EA] mb-4 relative inline-block">
                Alumni Events & Activities
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-10">
                Explore photos from our various alumni events, networking sessions, and community activities.
              </p>
              <div className="flex justify-center flex-wrap gap-3 mb-10">
                {eventCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                      activeCategory === category
                        ? 'bg-[#5A32EA] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 items-start grid-flow-dense mb-10" style={{ gridAutoRows: '1fr' }}>
                {(showAllEvents ? filteredEvents : filteredEvents.slice(0, 3)).map((evt, idx) => (
                  <div key={idx}>
                    <EventCard title={evt.title} imgSrc={evt.imgSrc} />
                  </div>
                ))}
              </div>
              {filteredEvents.length > 3 && !showAllEvents && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllEvents(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#5A32EA] text-[#5A32EA] shadow hover:bg-[#f3e8ff] transition-colors"
                    aria-label="Show more events"
                  >
                    <FaChevronDown className="w-6 h-6" />
                  </button>
                </div>
              )}
              {filteredEvents.length > 3 && showAllEvents && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setShowAllEvents(false);
                      setTimeout(() => {
                        if (eventsSectionRef.current) {
                          eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 50);
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#5A32EA] text-[#5A32EA] shadow hover:bg-[#f3e8ff] transition-colors"
                    aria-label="Collapse events list"
                  >
                    <FaChevronDown className="w-6 h-6 rotate-180" />
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
        {/* Footer */}
        <footer className="footer bg-[#F9F9F9] pt-20 pb-10 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h4 className="footer-title text-xl font-bold mb-6">
                  CUCEK Alumni Connect
                </h4>
                <p className="text-gray-600 mb-6">
                  Connecting CUCEK graduates worldwide to foster professional growth, meaningful relationships, and lifelong learning.
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-icon w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-[#5A32EA] hover:text-white hover:border-[#5A32EA] transition-all">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Quick Links</h5>
                <div className="space-y-4">
                  <a href="/" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Home</a>
                  <a href="/events" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Events</a>
                  <a href="/about" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">About</a>
                  <a href="/alumni" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Alumni</a>
                  <a href="/contact" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Contact</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Resources</h5>
                <div className="space-y-4">
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Blog</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Events</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Career Center</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">FAQ</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Support</a>
                </div>
              </div>
              <div>
                <h5 className="footer-title text-lg font-bold mb-6">Contact Us</h5>
                <div className="space-y-4">
                  <p className="text-gray-600"><i className="fas fa-envelope mr-2"></i> info@cucekalumni.org</p>
                  <p className="text-gray-600"><i className="fas fa-phone mr-2"></i> +1 (555) 123-4567</p>
                  <p className="text-gray-600"><i className="fas fa-map-marker-alt mr-2"></i> CUCEK University, Main Campus</p>
                </div>
                <div className="mt-6 space-y-2">
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Privacy Policy</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Terms of Service</a>
                  <a href="#" className="footer-link block text-gray-600 hover:text-[#5A32EA] transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
            <div className="copyright mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} CUCEK Alumni Connect. All rights reserved.
            </div>
          </div>
        </footer>
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-[#5A32EA] hover:bg-[#4321b8] text-white rounded-full p-4 shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
} 