import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Music, Heart, Youtube } from 'lucide-react';

export function getYouTubeVideoId(url) {
  if (!url) return null;
  const str = url.trim();
  if (str.length === 11 && !str.includes('/') && !str.includes('.')) return str;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = str.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function parseDurationToSeconds(durStr) {
  if (!durStr) return 180;
  if (typeof durStr === 'number') return durStr;
  const cleaned = String(durStr).trim();
  if (cleaned.includes(':')) {
    const parts = cleaned.split(':');
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed <= 0 ? 180 : parsed;
}

export default function CassettePlayer({ title, audioUrl, duration = "02:30" }) {
  const initialDuration = parseDurationToSeconds(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(initialDuration);
  const audioRef = useRef(null);
  const iframeRef = useRef(null);

  const youtubeId = getYouTubeVideoId(audioUrl);

  // Sync totalDuration whenever prop 'duration' changes
  useEffect(() => {
    const parsedSecs = parseDurationToSeconds(duration);
    if (parsedSecs > 0) {
      setTotalDuration(parsedSecs);
    }
  }, [duration]);

  const togglePlay = () => {
    if (youtubeId) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = isPlaying ? 'pauseVideo' : 'playVideo';
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      }
      setIsPlaying(!isPlaying);
      return;
    }

    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play prevented:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (youtubeId) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const command = isMuted ? 'unMute' : 'mute';
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: '' }),
          '*'
        );
      }
      setIsMuted(!isMuted);
      return;
    }

    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Sync YouTube player events (realtime current time & duration) via postMessage API
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setTotalDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 1) setIsPlaying(true);
            else if (data.info.playerState === 2 || data.info.playerState === 0) setIsPlaying(false);
          }
        }
      } catch (err) {
        // ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const onTimeUpdate = () => {
    if (!youtubeId && audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (!youtubeId && audioRef.current && audioRef.current.duration) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (youtubeId) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
          '*'
        );
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-pastel-lavender/40 max-w-lg mx-auto overflow-hidden">
      {/* Background Decorative Gloss */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Cassette Tape Header */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          {youtubeId ? (
            <Youtube className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <Music className="w-5 h-5 text-pastel-pink animate-pulse" />
          )}
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-pastel-pink">
            {youtubeId ? 'YOUTUBE STEREO PLAYER' : 'VINTAGE STEREO CASSETTE'}
          </span>
        </div>
        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-pastel-custard">
          {youtubeId ? 'YT AUDIO SOURCE' : 'SIDE A • HIGH FIDELITY'}
        </span>
      </div>

      {/* Cassette Window & Spinning Reels */}
      <div className="relative bg-slate-950/80 rounded-2xl p-4 border border-white/10 mb-5 flex items-center justify-between shadow-inner">
        {/* Left Reel */}
        <div className="flex flex-col items-center gap-1">
          <div className={`w-16 h-16 rounded-full border-4 border-dashed border-pastel-lavender/70 flex items-center justify-center bg-slate-900 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white/30 flex items-center justify-center">
              <Disc className="w-3 h-3 text-pastel-pink" />
            </div>
          </div>
        </div>

        {/* Tape View Window / Equalizer */}
        <div className="flex-1 mx-4 h-14 bg-amber-950/40 rounded-lg border border-amber-500/20 flex items-center justify-center px-2 relative overflow-hidden">
          <div className="w-full flex items-center justify-center gap-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-pastel-pink animate-pulse' : 'bg-white/20'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(8, Math.sin(i + currentTime) * 28 + 14)}px` : '6px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Reel */}
        <div className="flex flex-col items-center gap-1">
          <div className={`w-16 h-16 rounded-full border-4 border-dashed border-pastel-pink/70 flex items-center justify-center bg-slate-900 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white/30 flex items-center justify-center">
              <Disc className="w-3 h-3 text-pastel-lavender" />
            </div>
          </div>
        </div>
      </div>

      {/* Cassette Label Title */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4 border border-white/10 text-center">
        <h4 className="font-headline font-bold text-sm text-pastel-custard flex items-center justify-center gap-1.5 line-clamp-1">
          <Heart className="w-4 h-4 fill-pastel-pink text-pastel-pink" />
          {title || "Lagu Spesial dari Lesmana untuk Bebe 🎧"}
        </h4>
        <p className="text-[11px] text-white/70 font-mono mt-0.5">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </p>
      </div>

      {/* Progress Bar Seek Slider */}
      <div className="mb-4 px-1">
        <input
          type="range"
          min="0"
          max={totalDuration > 0 ? totalDuration : 100}
          step="1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pastel-pink"
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-pastel-pink" />}
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-pastel-pink to-pastel-lavender flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all btn-squish"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
        </button>

        <span className="text-xs font-mono font-bold text-pastel-pink bg-white/10 px-3 py-1 rounded-full border border-white/10">
          {isPlaying ? 'PLAYING ▶' : 'STOPPED ⏸'}
        </span>
      </div>

      {/* Hidden YouTube Iframe Player for YouTube Links */}
      {youtubeId ? (
        <iframe
          ref={iframeRef}
          className="hidden"
          width="100"
          height="100"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=0&controls=0`}
          title="YouTube Audio Player"
          allow="autoplay"
        />
      ) : (
        /* Standard HTML5 Audio for Direct MP3 Links */
        <audio
          ref={audioRef}
          src={audioUrl || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
