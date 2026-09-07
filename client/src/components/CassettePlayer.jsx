import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc, Music, Heart } from 'lucide-react';

export default function CassettePlayer({ title, audioUrl, duration = "02:30" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play prevented:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setTotalDuration(audioRef.current.duration || 0);
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
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-pastel-lavender/40 max-w-lg mx-auto overflow-hidden">
      {/* Background Decorative Gloss */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Cassette Tape Header */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-pastel-pink animate-pulse" />
          <span className="font-headline font-bold text-xs uppercase tracking-widest text-pastel-pink">
            VINTAGE STEREO CASSETTE
          </span>
        </div>
        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-pastel-custard">
          SIDE A • HIGH FIDELITY
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

        {/* Tape View Window */}
        <div className="flex-1 mx-4 h-12 bg-amber-950/40 rounded-lg border border-amber-500/20 flex items-center justify-center px-3 relative overflow-hidden">
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
          {title || "Pesan Suara Spesial dari Lesmana untuk Bebe 🎧"}
        </h4>
        <p className="text-[11px] text-white/70 font-mono mt-0.5">
          {formatTime(currentTime)} / {formatTime(totalDuration || 150)}
        </p>
      </div>

      {/* Progress Bar Slider */}
      <div className="mb-4 px-1">
        <input
          type="range"
          min="0"
          max={totalDuration || 150}
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

      {/* HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
