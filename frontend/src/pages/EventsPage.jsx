import React from 'react';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';

// Placeholder data - later this will come from an API
const eventsData = [
  {
    title: 'Annual Alumni Gala',
    date: 'October 25, 2025',
    description: 'Join us for a night of celebration, networking, and reminiscing at our biggest event of the year.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    status: 'Upcoming'
  },
  {
    title: 'Webinar: The Future of AI',
    date: 'November 12, 2025',
    description: 'A deep dive into the latest trends in Artificial Intelligence with industry expert and alumnus, Dr. Jane Foster.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    status: 'Upcoming'
  },
  {
    title: 'Homecoming Weekend 2025',
    date: 'December 5-7, 2025',
    description: 'Come back to campus for a weekend full of fun, football, and reconnecting with old friends.',
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800',
    status: 'Upcoming'
  },
  {
    title: 'East Coast Alumni Meetup',
    date: 'January 15, 2026',
    description: 'Alumni in the New York area are invited for a casual evening of networking and drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    status: 'Upcoming'
  },
  {
    title: 'Class of 2015: 10-Year Reunion',
    date: 'September 20, 2025',
    description: 'Can you believe it\'s been 10 years? Let\'s celebrate this milestone together!',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    status: 'Upcoming'
  },
  {
    title: 'Founders & Innovators Summit',
    date: 'July 22, 2025',
    description: 'A showcase of startups and businesses founded by our talented alumni. A day of pitches and networking.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    status: 'Past'
  }
];

const EventsPage = () => {
  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Events & Reunions</h1>
          <p className="mt-4 text-lg text-gray-600">Reconnect, learn, and celebrate with the alumni community.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 bg-white bg-opacity-80 backdrop-blur-md z-40 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search for an event..."
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>All Categories</option>
              <option>Reunions</option>
              <option>Webinars</option>
              <option>Networking</option>
              <option>On-Campus</option>
            </select>
            <select className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Upcoming Events</option>
              <option>Past Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {eventsData.map((event, index) => (
            <motion.div key={index} variants={itemVariants}>
              <EventCard
                title={event.title}
                date={event.date}
                description={event.description}
                imageUrl={event.imageUrl}
                status={event.status}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default EventsPage;