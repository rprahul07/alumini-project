import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder data for the gallery
const photos = [
  { id: 1, src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', caption: 'Graduation Day 2023', category: 'Graduation', decade: '2020s' },
  { id: 2, src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', caption: 'Study Group on the Lawn', category: 'Campus Life', decade: '2010s' },
  { id: 3, src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', caption: 'Homecoming Bonfire', category: 'Events', decade: '2010s' },
  { id: 4, src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800', caption: 'The Main Hall in Autumn', category: 'Campus Life', decade: '2020s' },
  { id: 5, src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800', caption: 'Lecture Series with a Guest Speaker', category: 'Events', decade: '2010s' },
  { id: 6, src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', caption: 'Victorious Soccer Team', category: 'Sports', decade: '2000s' },
  { id: 7, src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', caption: 'Late nights in the library', category: 'Campus Life', decade: '2000s' },
  { id: 8, src: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800', caption: 'Alumni Reunion 2019', category: 'Reunions', decade: '2010s' },
  { id: 9, src: 'https://images.unsplash.com/photo-1607237138185-e894ee31b2af?w=800', caption: 'A quiet corner of campus', category: 'Campus Life', decade: '2020s' },
];

const GalleryPage = () => {
  // useState hook to keep track of the currently selected image for the lightbox
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Moments & Memories</h1>
          <p className="mt-4 text-lg text-gray-600">Explore the history and happenings of our vibrant community.</p>
        </div>
      </div>
      
      {/* Filter Bar */}
       <div className="sticky top-16 bg-white bg-opacity-80 backdrop-blur-md z-40 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
            <select className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Filter by Decade</option>
              <option>2020s</option>
              <option>2010s</option>
              <option>2000s</option>
            </select>
            <select className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Filter by Category</option>
              <option>Campus Life</option>
              <option>Events</option>
              <option>Graduation</option>
              <option>Reunions</option>
              <option>Sports</option>
            </select>
        </div>
      </div>

      {/* Image Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <motion.div 
              key={photo.id} 
              className="break-inside-avoid cursor-pointer"
              onClick={() => setSelectedImage(photo)}
              whileHover={{ scale: 1.05 }}
              layoutId={`card-${photo.id}`}
            >
              <img className="rounded-lg shadow-lg w-full" src={photo.src} alt={photo.caption} />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)} // Close when clicking the backdrop
          >
            <motion.div 
              className="relative"
              layoutId={`card-${selectedImage.id}`}
            >
              <img 
                className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl" 
                src={selectedImage.src} 
                alt={selectedImage.caption} 
              />
            </motion.div>
             {/* Add caption and close button separate from the image to avoid layout shifts */}
            <div className="absolute bottom-10 text-white text-lg bg-black bg-opacity-50 px-4 py-2 rounded-md">
                {selectedImage.caption}
            </div>
            <button 
              className="absolute top-5 right-5 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;