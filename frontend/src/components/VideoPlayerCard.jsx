import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

export default function VideoPlayerCard({ 
  src, 
  title, 
  description, 
  thumbnail, 
  duration,
  tags = [],
  notes,
  className = "",
  onProgressUpdate,
  initialProgress = 0
}) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showVideo || !isPlaying) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, showVideo, isPlaying]);

  // Update progress callback
  useEffect(() => {
    if (onProgressUpdate && currentTime > 0) {
      onProgressUpdate(currentTime, videoDuration);
    }
  }, [currentTime, videoDuration, onProgressUpdate]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setVideoDuration(video.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setBuffered((bufferedEnd / duration) * 100);
        }
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('progress', updateBuffered);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('progress', updateBuffered);
    };
  }, [showVideo]);

  const handlePlayClick = () => {
    if (!showVideo) {
      setShowVideo(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * videoDuration;
    
    video.currentTime = clickTime;
    setCurrentTime(clickTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  if (!src) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-400 text-4xl mb-2">📹</div>
        <p className="text-gray-500 dark:text-gray-400">No video available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        {!showVideo ? (
          // Thumbnail with Play Button
          <div className="relative w-full h-full group cursor-pointer" onClick={handlePlayClick}>
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-6xl">🎬</div>
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
              <div className="bg-white bg-opacity-90 rounded-full p-6 group-hover:scale-110 transition-transform">
                <Play className="w-12 h-12 text-blue-600 ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            {duration && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {formatTime(duration)}
              </div>
            )}

            {/* Resume Badge */}
            {initialProgress > 0 && (
              <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Resume
              </div>
            )}
          </div>
        ) : (
          // Video Player
          <div 
            className="relative w-full h-full"
            onMouseEnter={() => setShowControls(true)}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={src}
              className="w-full h-full"
              onClick={handlePlayClick}
              onLoadStart={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
            />

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Loading video...</p>
                </div>
              </div>
            )}

            {/* Custom Controls */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  ref={progressRef}
                  className="w-full h-2 bg-white bg-opacity-30 rounded cursor-pointer relative"
                  onClick={handleProgressClick}
                >
                  {/* Buffered Progress */}
                  <div 
                    className="absolute h-full bg-white bg-opacity-50 rounded"
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Current Progress */}
                  <div 
                    className="absolute h-full bg-blue-500 rounded transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  {/* Progress Handle */}
                  <div 
                    className="absolute w-4 h-4 bg-blue-500 rounded-full -top-1 transform -translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={handlePlayClick}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" fill="currentColor" />
                    ) : (
                      <Play className="w-6 h-6" fill="currentColor" />
                    )}
                  </button>

                  {/* Time Display */}
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(videoDuration)}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Volume Control */}
                  <div className="flex items-center space-x-2 group">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Metadata */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📝 Notes</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
