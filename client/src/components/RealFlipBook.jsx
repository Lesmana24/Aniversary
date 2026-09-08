import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Volume,
  RotateCcw
} from 'lucide-react';

export default function RealFlipBook({ memories = [], onDelete }) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1..N = Memory spreads, N+1 = Back Cover
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'
  const [soundEnabled, setSoundEnabled] = useState(true);

  const totalPages = memories.length + 2; // Cover + Memories + Back Cover

  // Synthesize realistic paper rustle sound using Web Audio API
  const playPageTurnSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.25));
        data[i] = (Math.random() * 2 - 1) * decay * 0.12;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.18);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Ignore sound errors if audio context blocked by browser policy
    }
  }, [soundEnabled]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      playPageTurnSound();
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 400);
    }
  }, [currentPage, totalPages, isFlipping, playPageTurnSound]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      playPageTurnSound();
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 400);
    }
  }, [currentPage, isFlipping, playPageTurnSound]);

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Active Memory (null if on Cover or Back cover)
  const currentMemoryIndex = currentPage - 1;
  const activeMemory = (currentMemoryIndex >= 0 && currentMemoryIndex < memories.length)
    ? memories[currentMemoryIndex]
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-pastel-pink/30 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Page Counter & Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pastel-lavender/20 text-pastel-lavender-dark flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm text-pastel-lavender-dark">
              {currentPage === 0
                ? 'Cover Buku Scrapbook'
                : currentPage === totalPages - 1
                ? 'Halaman Penutup'
                : `Halaman ${currentPage} dari ${memories.length}`}
            </h3>
            <p className="text-[11px] text-pastel-text/70 font-medium">
              Gunakan tombol navigasi, panah keyboard (← →), atau klik halaman untuk membalik.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-pastel-pink/10 text-pastel-pink-dark border-pastel-pink/40'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}
            title={soundEnabled ? 'Matikan Suara Kertas' : 'Aktifkan Suara Kertas'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Suara On' : 'Mute'}</span>
          </button>

          {/* Reset to Cover */}
          <button
            onClick={() => {
              if (currentPage !== 0 && !isFlipping) {
                playPageTurnSound();
                setCurrentPage(0);
              }
            }}
            className="p-2 rounded-xl bg-pastel-surface hover:bg-pastel-pink/20 text-pastel-lavender-dark border border-pastel-pink/30 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Kembali ke Cover Depan"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Ke Cover</span>
          </button>
        </div>
      </div>

      {/* 3D BOOK STAGE CONTAINER */}
      <div className="relative perspective-1000 py-2 sm:py-6">
        <div 
          className={`relative min-h-[480px] sm:min-h-[540px] w-full max-w-3xl mx-auto rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
            isFlipping ? (flipDirection === 'next' ? 'rotate-y-[-6deg]' : 'rotate-y-[6deg]') : ''
          }`}
        >
          {/* COVER PAGE SPREAD (CurrentPage === 0) */}
          {currentPage === 0 && (
            <div className="w-full min-h-[480px] sm:min-h-[540px] rounded-3xl bg-gradient-to-br from-[#f8ece1] via-[#fff5eb] to-[#fce4ec] border-4 border-dashed border-pastel-pink/40 shadow-scrapbook p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
                 onClick={goToNextPage}>
              {/* Washi tape top banner */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 washi-tape px-6 py-1 rounded-sm text-xs font-headline font-bold text-pastel-pink-dark shadow-sm">
                2nd Anniversary Romantic Memory Book
              </div>

              {/* Decorative background elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pastel-pink/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pastel-lavender/20 rounded-full blur-2xl"></div>

              {/* Heart Badge & Frame */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-pastel-pink shadow-sticker flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-pastel-pink text-pastel-pink animate-pulse" />
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-white/90 text-pastel-pink-dark font-headline font-extrabold text-xs border border-pastel-pink/40 shadow-sm mb-3">
                📖 ALBUM KENANGAN KENCAN
              </span>

              <h1 className="font-headline font-black text-3xl sm:text-5xl text-pastel-lavender-dark mb-4 leading-tight">
                Lesmana & Nafla
              </h1>

              <p className="font-handwriting text-2xl sm:text-3xl text-pastel-pink-dark mb-6">
                "730 Hari Bersama, Penuh Cinta, Tawa & Cerita Manis"
              </p>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-pastel-text/80 bg-white/80 px-4 py-2 rounded-2xl border border-pastel-pink/30 shadow-sm mb-8">
                <Calendar className="w-4 h-4 text-pastel-lavender" />
                <span>8 September 2024 – 8 September 2026</span>
              </div>

              <div className="animate-bounce inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-105 transition-all">
                <span>Klik atau Panah Kanan untuk Buka Buku 📖</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* BACK COVER PAGE SPREAD (CurrentPage === totalPages - 1) */}
          {currentPage === totalPages - 1 && (
            <div className="w-full min-h-[480px] sm:min-h-[540px] rounded-3xl bg-gradient-to-br from-[#fcf4ec] via-[#f8e8ee] to-[#edf2ff] border-4 border-dashed border-pastel-lavender/40 shadow-scrapbook p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
                 onClick={goToPrevPage}>
              <div className="w-20 h-20 rounded-full bg-white border-4 border-pastel-lavender shadow-sticker flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-pastel-lavender-dark animate-spin-slow" />
              </div>

              <h2 className="font-headline font-black text-3xl sm:text-4xl text-pastel-lavender-dark mb-3">
                Penutup & Harapan 💕
              </h2>

              <p className="font-handwriting text-2xl sm:text-3xl text-slate-700 max-w-lg leading-relaxed mb-6">
                "Terima kasih telah menemani dan mengukir setiap kenangan indah ini. Semoga perjalanan tahun ke-3 kita semakin manis!"
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-pastel-pink-dark font-headline font-bold text-xs border border-pastel-pink/40 shadow-sm mb-6">
                <span>Total {memories.length} Momen Indah Tersimpan</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPageTurnSound();
                  setCurrentPage(0);
                }}
                className="px-6 py-3 rounded-2xl bg-pastel-pink text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-105 active:scale-95 transition-all btn-squish flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Baca Ulang dari Cover Depan</span>
              </button>
            </div>
          )}

          {/* MEMORY SPREAD PAGE (CurrentPage 1..memories.length) */}
          {activeMemory && (
            <div className="w-full min-h-[480px] sm:min-h-[540px] rounded-3xl bg-[#fffcf7] border-2 border-pastel-pink/30 shadow-scrapbook overflow-hidden flex flex-col md:flex-row relative">
              {/* BOOK SPINE CREASE SHADOW (Middle binding visual effect) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/10 via-black/5 to-transparent z-20 pointer-events-none border-r border-black/5"></div>

              {/* LEFT PAGE: POLAROID PHOTO FRAME */}
              <div className="md:w-1/2 p-6 sm:p-8 bg-[#fffbf5] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-pastel-pink/30 relative">
                {/* Washi tape decorator */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 washi-tape-pink px-4 py-0.5 rounded-sm text-[10px] font-headline font-bold text-pastel-pink-dark shadow-sm z-10">
                  {activeMemory.category?.toUpperCase() || 'MEMORY'}
                </div>

                {/* POLAROID CARD CONTAINER */}
                <div className="w-full max-w-xs bg-white p-4 rounded-xl shadow-polaroid border border-gray-100 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-200">
                    <img
                      src={activeMemory.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'}
                      alt={activeMemory.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-headline font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pastel-pink" />
                      <span className="truncate max-w-[140px]">{activeMemory.location || 'Lokasi Kencan'}</span>
                    </div>
                  </div>

                  {/* Caption & Date under Polaroid */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-pastel-lavender-dark">
                      <Calendar className="w-3.5 h-3.5 text-pastel-pink" />
                      <span>{activeMemory.date}</span>
                    </div>
                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(activeMemory.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PAGE: HANDWRITTEN MEMO & STORY */}
              <div className="md:w-1/2 p-6 sm:p-8 bg-[#fffcf7] flex flex-col justify-between relative">
                {/* Top Header Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pastel-pink-dark bg-pastel-pink/15 px-2.5 py-1 rounded-full border border-pastel-pink/30">
                      📖 Memo Kencan #{currentMemoryIndex + 1}
                    </span>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(activeMemory.id)}
                        className="text-[10px] text-rose-500 hover:text-rose-700 hover:underline font-bold"
                      >
                        Hapus Kenangan
                      </button>
                    )}
                  </div>

                  <h2 className="font-headline font-extrabold text-xl sm:text-2xl text-pastel-lavender-dark leading-snug">
                    {activeMemory.title}
                  </h2>

                  {/* Handwritten Story Box */}
                  <div className="bg-white/80 p-4 sm:p-5 rounded-2xl border border-pastel-pink/20 shadow-sm relative min-h-[160px]">
                    {/* Subtle notebook lined background effect */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none rounded-2xl"></div>

                    <p className="font-handwriting text-xl sm:text-2xl text-slate-700 leading-relaxed relative z-10">
                      "{activeMemory.story || 'Tidak ada catatan cerita untuk momen kencan ini.'}"
                    </p>
                  </div>
                </div>

                {/* Bottom Decorative Footer */}
                <div className="pt-4 flex items-center justify-between border-t border-dashed border-pastel-pink/30 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-pastel-text/80 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scrapbook Lesmana & Nafla</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-pastel-lavender-dark">
                    Hal. {currentPage} / {memories.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAVIGATION & SLIDER CONTROLS */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-pastel-pink/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Page Button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0 || isFlipping}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-headline font-bold text-xs flex items-center justify-center gap-2 transition-all btn-squish ${
            currentPage === 0
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-pastel-surface text-pastel-lavender-dark hover:bg-pastel-pink/20 border border-pastel-pink/30 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Halaman Sebelumnya</span>
        </button>

        {/* Page Jump Slider Bar */}
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <span className="text-xs font-mono font-bold text-pastel-text/70 whitespace-nowrap">
            Cover
          </span>
          <input
            type="range"
            min="0"
            max={totalPages - 1}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isFlipping && val !== currentPage) {
                playPageTurnSound();
                setCurrentPage(val);
              }
            }}
            className="w-full accent-pastel-pink cursor-pointer h-2 bg-pastel-pink/20 rounded-lg"
          />
          <span className="text-xs font-mono font-bold text-pastel-text/70 whitespace-nowrap">
            Penutup
          </span>
        </div>

        {/* Next Page Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1 || isFlipping}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-headline font-bold text-xs flex items-center justify-center gap-2 transition-all btn-squish ${
            currentPage === totalPages - 1
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-pastel-lavender text-white shadow-squish hover:scale-105'
          }`}
        >
          <span>Halaman Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
