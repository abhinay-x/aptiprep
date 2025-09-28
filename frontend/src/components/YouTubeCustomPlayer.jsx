import { useEffect, useRef, useState } from 'react';

export default function YouTubeCustomPlayer({ videoId, title, className = '' }) {
  const iframeRef = useRef(null);
  const [iframeId] = useState(() => `yt-player-${Math.random().toString(36).slice(2)}`);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(origin)}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=1&disablekb=1`;

  const post = (func, args = []) => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
    } catch (_) {}
  };

  // Send the initial 'listening' event and register event listeners per YouTube's protocol
  const initYouTubeBridge = () => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      // Announce we are listening
      win.postMessage(JSON.stringify({ event: 'listening', id: iframeId }), '*');
      // Ask YouTube to send events
      ['onReady', 'onStateChange', 'onPlaybackQualityChange', 'onPlaybackRateChange', 'onError'].forEach(evt => {
        win.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: [evt] }), '*');
      });
    } catch (_) {}
  };

  useEffect(() => {
    const onMessage = (event) => {
      // Only accept messages from YouTube domains
      const acceptable = typeof event.origin === 'string' && (event.origin.includes('youtube.com') || event.origin.includes('youtube-nocookie.com'));
      if (!acceptable) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === 'onReady') {
          setIsReady(true);
          // Query initial data
          post('getDuration');
          post('getPlayerState');
          post('isMuted');
        }

        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') setCurrentTime(data.info.currentTime);
          if (typeof data.info.duration === 'number') setDuration(data.info.duration);
          if (typeof data.info.playerState === 'number') setIsPlaying(data.info.playerState === 1);
          if (typeof data.info.muted === 'boolean') setIsMuted(data.info.muted);
        }

        // Some implementations send direct responses (not only infoDelivery)
        if (typeof data === 'object' && data.info === undefined) {
          // no-op fallback
        }
      } catch (_) {}
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Poll for time/duration when ready
  useEffect(() => {
    if (!isReady) return;
    const id = setInterval(() => {
      post('getCurrentTime');
      post('getDuration');
      post('getPlayerState');
      post('isMuted');
    }, 500);
    return () => clearInterval(id);
  }, [isReady]);

  // Initialize bridge after iframe loads (ensures contentWindow is available)
  const handleIframeLoad = () => {
    initYouTubeBridge();
  };

  const togglePlay = () => {
    if (!isReady) return;
    if (isPlaying) post('pauseVideo'); else post('playVideo');
  };

  const toggleMute = () => {
    if (!isReady) return;
    if (isMuted) post('unMute'); else post('mute');
  };

  const handleSeek = (e) => {
    if (!isReady || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(Math.max(clickX / rect.width, 0), 1);
    const target = pct * duration;
    post('seekTo', [target, true]);
  };

  const enterFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      <iframe
        ref={iframeRef}
        id={iframeId}
        src={embedUrl}
        title={title}
        className="w-full aspect-video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleIframeLoad}
      />

      {/* Overlay controls (custom). Note: YouTube logo may still appear; cannot be fully removed per YouTube policies. */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 opacity-100 group-hover:opacity-100 transition-opacity pointer-events-auto">
          {/* Progress */}
          <div className="mb-3">
            <div className="w-full h-1 bg-white/30 rounded cursor-pointer" onClick={handleSeek}>
              <div className="h-full bg-blue-500 rounded" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:text-blue-400" title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleMute} className="text-white hover:text-blue-400" title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
              <button onClick={enterFullscreen} className="text-white hover:text-blue-400" title="Fullscreen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
