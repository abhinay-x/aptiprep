import { useState, useRef, useEffect } from 'react';
import VideoPlayerCard from './VideoPlayerCard';

// Legacy wrapper component for backward compatibility
export default function CustomVideoPlayer({ src, title, className = "" }) {
  // Check if this is a YouTube embed URL
  const isYouTubeEmbed = src && src.includes('youtube.com/embed/');
  
  // For YouTube embeds, render an iframe (temporary solution)
  if (isYouTubeEmbed) {
    return (
      <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={src}
          title={title}
          className="w-full aspect-video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // For regular video files, use the new VideoPlayerCard
  return (
    <VideoPlayerCard
      src={src}
      title={title}
      className={className}
    />
  );
}
