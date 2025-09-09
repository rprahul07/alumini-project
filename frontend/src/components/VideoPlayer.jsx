import React, { useState, useRef } from 'react';

const VideoPlayer = ({ 
  videoId = null, 
  title = "CUCEK Alumni Network", 
  description = "Click to play our story",
  duration = "5:30 min",
  views = "2.5K views",
  year = "2024",
  onPlay = null,
  onShare = null
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
    
    // If we have a videoId, we can integrate with YouTube API here
    if (videoId) {
      // YouTube integration will be added later
      console.log('Playing video:', videoId);
    }
  };

  const handleShare = () => {
    if (onShare) onShare();
    
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative group">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
        {/* Video Player Container */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* YouTube Video Player Placeholder */}
          <div className="relative w-full h-full">
            {!isPlaying ? (
              // Play Button Overlay
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer" onClick={handlePlay}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-play text-white text-3xl ml-1"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/80 text-sm">{description}</p>
                </div>
              </div>
            ) : (
              // Video Content (YouTube embed will go here)
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <i className="fas fa-play text-white text-2xl ml-1"></i>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Video Loading...</h3>
                  <p className="text-white/80 text-sm">YouTube integration coming soon</p>
                </div>
              </div>
            )}
            
            {/* Video Controls Overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                showControls || isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    onClick={handlePlay}
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-sm`}></i>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <i className="fas fa-volume-up text-white text-xs"></i>
                    </button>
                    <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <i className="fas fa-cog text-white text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                    <i className="fas fa-expand text-white text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Video Info Card */}
      <div className="mt-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate">Our Alumni Success Stories</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                Discover how our graduates are making a difference in technology, innovation, and society worldwide.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <i className="fas fa-clock mr-1 text-primary"></i>
                  {duration}
                </span>
                <span className="flex items-center">
                  <i className="fas fa-eye mr-1 text-primary"></i>
                  {views}
                </span>
                <span className="flex items-center">
                  <i className="fas fa-calendar mr-1 text-primary"></i>
                  {year}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center text-sm"
                onClick={handlePlay}
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button 
                className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors duration-200 flex items-center text-sm"
                onClick={handleShare}
              >
                <i className="fas fa-share mr-1"></i>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
