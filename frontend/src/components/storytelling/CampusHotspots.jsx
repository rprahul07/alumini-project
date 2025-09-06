import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CampusHotspots = () => {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspots = [
    {
      id: 'library',
      x: 35,
      y: 25,
      icon: '📚',
      title: 'Central Library',
      description: 'Where countless hours of study and discovery happened',
      memory: 'Late night study sessions and finding that perfect book',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'canteen',
      x: 60,
      y: 45,
      icon: '🍽️',
      title: 'Campus Canteen',
      description: 'The heart of campus social life and delicious memories',
      memory: 'Sharing meals, laughter, and unforgettable conversations',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'lab',
      x: 25,
      y: 60,
      icon: '🔬',
      title: 'Engineering Labs',
      description: 'Where theory met practice and innovation was born',
      memory: 'Building projects and turning ideas into reality',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'auditorium',
      x: 70,
      y: 30,
      icon: '🎭',
      title: 'Main Auditorium',
      description: 'Stage for cultural events and memorable celebrations',
      memory: 'Graduation ceremonies and cultural performances',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'playground',
      x: 45,
      y: 70,
      icon: '⚽',
      title: 'Sports Ground',
      description: 'Where champions were made and friendships forged',
      memory: 'Cricket matches, morning runs, and team spirit',
      color: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <section id="campus-highlights" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100 to-indigo-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-800 mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Campus Memories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Campus Hotspots
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on the hotspots to relive your favorite campus memories
          </p>
        </motion.div>

        {/* Interactive Campus Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Campus Image Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/PXL_20250825_124106600.png"
              alt="CUCEK Campus Interactive Map"
              className="w-full h-auto object-contain"
            />
            
            {/* Overlay for better hotspot visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                className={`absolute w-12 h-12 rounded-full bg-gradient-to-r ${hotspot.color} text-white text-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: activeHotspot === hotspot.id ? 1.2 : 1,
                  boxShadow: activeHotspot === hotspot.id 
                    ? '0 0 0 8px rgba(99, 102, 241, 0.3)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {hotspot.icon}
                
                {/* Pulse effect for active hotspot */}
                {activeHotspot === hotspot.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Hotspot Details Modal */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setActiveHotspot(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const hotspot = hotspots.find(h => h.id === activeHotspot);
                    if (!hotspot) return null;
                    
                    return (
                      <>
                        <div className="text-center mb-6">
                          <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${hotspot.color} rounded-full flex items-center justify-center text-white text-3xl mb-4`}>
                            {hotspot.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {hotspot.title}
                          </h3>
                          <p className="text-gray-600">
                            {hotspot.description}
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                          <p className="text-gray-700 italic">
                            "{hotspot.memory}"
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setActiveHotspot(null)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                        >
                          Close
                        </button>
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default CampusHotspots;
