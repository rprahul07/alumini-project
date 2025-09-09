import React, { useState, useRef, useEffect, useCallback } from 'react';

const VideoPlayer = ({ 
  videoId = "R_hQzJ0jRqE", // Default to the provided YouTube video
  title = "CUCEK Alumni Network", 
  description = "Click to play our story",
  duration = "5:30 min",
  views = "2.5K views",
  year = "2024",
  onPlay = null,
  onShare = null,
  autoplay = false,
  muted = true,
  loop = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for performance optimization
  useEffect(() => {
    if (!videoRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(videoRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(true);
    setHasError(false);
    if (onPlay) onPlay();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const handleShare = useCallback(() => {
    if (onShare) onShare();
    
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: `https://youtu.be/${videoId}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`https://youtu.be/${videoId}`);
      alert('Video link copied to clipboard!');
    }
  }, [onShare, title, description, videoId]);

  // Generate YouTube embed URL with parameters
  const getYouTubeEmbedUrl = useCallback(() => {
    const params = new URLSearchParams({
      autoplay: isPlaying ? '1' : '0',
      mute: isMuted ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: '1',
      rel: '0', // Don't show related videos
      modestbranding: '1', // Minimal YouTube branding
      playsinline: '1', // Play inline on mobile
      enablejsapi: '1', // Enable JavaScript API
      origin: window.location.origin
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, isPlaying, isMuted, loop]);

  return (
    <div className="relative group" ref={videoRef}>
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
        {/* Video Player Container */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* YouTube Video Player */}
          <div className="relative w-full h-full">
            {!isPlaying ? (
              // Play Button Overlay
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer" 
                onClick={handlePlay}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                aria-label={`Play video: ${title}`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-play text-white text-2xl ml-1"></i>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                  <p className="text-white/80 text-xs px-4">{description}</p>
                  {isMuted && (
                    <div className="mt-1 flex items-center justify-center text-white/60 text-xs">
                      <i className="fas fa-volume-mute mr-1"></i>
                      Muted by default
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // YouTube iframe
              <div className="absolute inset-0">
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                        <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Loading Video...</h3>
                      <p className="text-white/80 text-sm">Please wait</p>
                    </div>
                  </div>
                )}
                
                {hasError ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-red-600/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto">
                        <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Video Unavailable</h3>
                      <p className="text-white/80 text-sm mb-4">Unable to load the video</p>
                      <button 
                        onClick={() => {
                          setHasError(false);
                          setIsPlaying(false);
                        }}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={isInView ? getYouTubeEmbedUrl() : ''}
                    title={title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                  />
                )}
              </div>
            )}
            
            {/* Video Controls Overlay */}
            {isPlaying && (
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                      onClick={isPlaying ? handlePause : handlePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-sm`}></i>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                        onClick={handleMuteToggle}
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      >
                        <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-white text-xs`}></i>
                      </button>
                      <div className="text-white/80 text-xs px-2 py-1 bg-black/20 backdrop-blur-sm rounded">
                        {isMuted ? 'Muted' : 'Unmuted'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                      onClick={() => {
                        if (iframeRef.current) {
                          iframeRef.current.requestFullscreen?.();
                        }
                      }}
                      aria-label="Enter fullscreen"
                    >
                      <i className="fas fa-expand text-white text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Video Info Card */}
      <div className="mt-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-md flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white text-xs"></i>
                </div>
                <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
              </div>
              <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                {description}
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
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
                {isMuted && (
                  <span className="flex items-center text-orange-500">
                    <i className="fas fa-volume-mute mr-1"></i>
                    Muted
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button 
                className="px-3 py-1.5 bg-primary text-white rounded-md font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center text-xs"
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={isLoading}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : isPlaying ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </button>
              <button 
                className="px-3 py-1.5 border border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-white transition-colors duration-200 flex items-center text-xs"
                onClick={handleMuteToggle}
                disabled={!isPlaying}
              >
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} mr-1`}></i>
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button 
                className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center text-xs"
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
