import React, { useState } from 'react';
import JourneyCard from '../components/about/JourneyCard';
import AlumniCard from '../components/about/AlumniCard';
import EventCard from '../components/about/EventCard';
import Navbar from '../components/Navbar';
import { FaArrowUp } from 'react-icons/fa';

export default function AboutUsPage() {
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

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-12 bg-gradient-to-b from-indigo-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                About CUCEK & Alumni Connect
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                CUCEK is a premier educational institution dedicated to fostering excellence in higher education. Our Alumni Connect platform brings together our vast network of successful graduates, creating a community of lifelong learning and professional growth.
              </p>
            </div>
          </div>
        </section>
        {/* Main Content */}
        <div className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
            {/* Section 1: Journey & Image as cards */}
            <section className="flex flex-col lg:flex-row items-stretch justify-between w-full gap-8">
              <div className="w-full lg:w-7/12 flex items-center">
                <JourneyCard />
              </div>
              <div className="w-full lg:w-5/12 flex items-center justify-center">
                <img
                  src="https://lnk.ink/v2039"
                  alt="Journey"
                  className="w-full max-h-[350px] object-cover rounded-3xl shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200"
                />
              </div>
            </section>
            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-[#5A32EA] to-transparent" />
            {/* Section 2: Alumni Success Stories */}
            <section className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5A32EA] mb-4 relative inline-block">
                Alumni Success Stories
              </h2>
              <p className="text-base md:text-lg text-gray-600 mt-4 mb-12 max-w-3xl mx-auto">
                Discover how CUCEK alumni are making an impact across the globe.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {alumniData.map((alum, idx) => (
                  <AlumniCard key={idx} {...alum} />
                ))}
              </div>
            </section>
            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-[#5A32EA] to-transparent" />
            {/* Section 3: Events & Activities */}
            <section className="text-center">
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
              <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-row-dense gap-6">
                {filteredEvents.map((evt, idx) => (
                  <div key={idx} className={`${evt.span}`}>
                    <EventCard title={evt.title} imgSrc={evt.imgSrc} />
                  </div>
                ))}
              </div>
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
      </div>
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 bg-[#5A32EA] hover:bg-[#4321b8] text-white rounded-full p-4 shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </button>
    </>
  );
} 