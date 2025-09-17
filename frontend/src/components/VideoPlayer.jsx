import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInteractionTracking, useAnalytics } from '../hooks/useAnalytics';

const VideoPlayer = ({ 
  videoId = "R_hQzJ0jRqE", // Default to the provided YouTube video
  title = "More than a college — it's family", 
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
  
  // Analytics tracking
  const { trackClick, trackHover } = useInteractionTracking('video');
  const { trackEngagement } = useAnalytics();
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
    // Track video play
    trackEngagement('video_play', {
      video_id: videoId,
      video_title: title,
      video_duration: duration
    });
    
    setIsPlaying(true);
    setIsLoading(true);
    setHasError(false);
    if (onPlay) onPlay();
  }, [onPlay, videoId, title, duration, trackEngagement]);

  const handlePause = useCallback(() => {
    // Track video pause
    trackEngagement('video_pause', {
      video_id: videoId,
      video_title: title,
      video_duration: duration
    });
    
    setIsPlaying(false);
  }, [videoId, title, duration, trackEngagement]);

  const handleMuteToggle = useCallback(() => {
    // Track mute toggle
    trackEngagement('video_mute_toggle', {
      video_id: videoId,
      video_title: title,
      muted: !isMuted
    });
    
    setIsMuted(!isMuted);
  }, [isMuted, videoId, title, trackEngagement]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const handleShare = useCallback(() => {
    // Track video share
    trackEngagement('video_share', {
      video_id: videoId,
      video_title: title,
      share_method: navigator.share ? 'native' : 'clipboard'
    });
    
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
  }, [onShare, title, description, videoId, trackEngagement]);

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
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg transform group-hover:scale-[1.02] transition-all duration-500 border border-slate-200/50 hover:shadow-xl" style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    }}>
        {/* Video Player Container */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          {/* YouTube Video Player */}
          <div className="relative w-full h-full">
            {!isPlaying ? (
              // Play Button Overlay
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 flex items-center justify-center cursor-pointer" 
                onClick={handlePlay}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                aria-label={`Play video: ${title}`}
              >
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <i className="fas fa-play text-white text-lg ml-1"></i>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 font-sans">{title}</h3>
                  <p className="text-slate-600 text-xs px-4 font-sans">{description}</p>
                  {isMuted && (
                    <div className="mt-1 flex items-center justify-center text-slate-500 text-xs font-sans">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto animate-pulse shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-spinner fa-spin text-white text-lg"></i>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 font-sans">Loading Video...</h3>
                      <p className="text-slate-600 text-xs font-sans">Please wait</p>
                    </div>
                  </div>
                )}
                
                {hasError ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-red-200/60 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-red-500 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}>
                        <i className="fas fa-exclamation-triangle text-white text-lg"></i>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 font-sans">Video Unavailable</h3>
                      <p className="text-slate-600 text-xs mb-3 font-sans">Unable to load the video</p>
                      <button 
                        onClick={() => {
                          setHasError(false);
                          setIsPlaying(false);
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 backdrop-blur-sm rounded-lg text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg text-xs font-sans"
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
                  <div className="flex items-center space-x-2">
                    <button 
                      className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg" style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                      onClick={isPlaying ? handlePause : handlePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xs`}></i>
                    </button>
                    <div className="flex items-center space-x-1">
                      <button 
                        className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
                        onClick={handleMuteToggle}
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      >
                        <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-slate-700 text-xs`}></i>
                      </button>
                      <div className="text-slate-700 text-xs px-2 py-1 bg-white/90 backdrop-blur-sm rounded shadow-md font-sans">
                        {isMuted ? 'Muted' : 'Unmuted'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
                      onClick={() => {
                        if (iframeRef.current) {
                          iframeRef.current.requestFullscreen?.();
                        }
                      }}
                      aria-label="Enter fullscreen"
                    >
                      <i className="fas fa-expand text-slate-700 text-xs"></i>
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
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200/50 hover:shadow-xl hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1" style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}>
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="mb-2 sm:mb-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight font-sans">{title}</h3>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-1 flex-wrap">
              <button 
                className="px-3 py-1.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 backdrop-blur-sm text-white rounded-full font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center text-xs sm:text-xs shadow-lg hover:shadow-xl min-w-[70px] sm:min-w-0 font-sans"
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={isLoading}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : isPlaying ? 'fa-pause' : 'fa-play'} mr-1 sm:mr-1 text-xs`}></i>
                <span className="hidden sm:inline">{isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}</span>
                <span className="sm:hidden">{isLoading ? '...' : isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button 
                className="px-3 py-1.5 sm:px-3 sm:py-1.5 bg-slate-100 backdrop-blur-sm text-slate-700 rounded-full font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center text-xs sm:text-xs min-w-[70px] sm:min-w-0 font-sans"
                onClick={handleMuteToggle}
                disabled={!isPlaying}
              >
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} mr-1 sm:mr-1 text-xs`}></i>
                <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
                <span className="sm:hidden">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button 
                className="px-3 py-1.5 sm:px-3 sm:py-1.5 bg-slate-100 backdrop-blur-sm text-slate-700 rounded-full font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center text-xs sm:text-xs min-w-[70px] sm:min-w-0 font-sans"
                onClick={handleShare}
              >
                <i className="fas fa-share mr-1 sm:mr-1 text-xs"></i>
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
