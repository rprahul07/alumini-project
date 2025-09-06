import React from 'react';
import { motion } from 'framer-motion';

const FloatingCampusImage = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating Campus Image */}
      <motion.div
        className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-64 h-64 opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src="/PXL_20250825_124106600.png"
          alt="CUCEK Campus Background"
          className="w-full h-full object-cover rounded-2xl shadow-2xl"
        />
      </motion.div>

      {/* Floating Scholar Caps around the image */}
      {[
        { x: 20, y: 30, size: 'text-2xl', color: 'text-indigo-400', delay: 0 },
        { x: 80, y: 20, size: 'text-xl', color: 'text-purple-400', delay: 1 },
        { x: 70, y: 70, size: 'text-3xl', color: 'text-blue-400', delay: 2 },
        { x: 10, y: 80, size: 'text-lg', color: 'text-green-400', delay: 3 },
        { x: 90, y: 60, size: 'text-2xl', color: 'text-orange-400', delay: 4 }
      ].map((cap, index) => (
        <motion.div
          key={index}
          className={`absolute ${cap.size} ${cap.color} drop-shadow-lg`}
          style={{
            left: `${cap.x}%`,
            top: `${cap.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            delay: cap.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎓
        </motion.div>
      ))}

      {/* Floating Memory Particles */}
      {[
        { x: 15, y: 25, text: '📚', delay: 0 },
        { x: 85, y: 35, text: '🍽️', delay: 1 },
        { x: 25, y: 75, text: '🔬', delay: 2 },
        { x: 75, y: 85, text: '⚽', delay: 3 },
        { x: 50, y: 15, text: '🎭', delay: 4 }
      ].map((particle, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 8,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {particle.text}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCampusImage;
