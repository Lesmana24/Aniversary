import React, { useState, useRef, useEffect, useCallback } from 'react';
import HTML5FlipBook from 'react-pageflip';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  Volume2, 
  VolumeX,
  RotateCcw
} from 'lucide-react';

// ForwardRef Page Wrapper Component required by react-pageflip
const Page = React.forwardRef(({ children, className = '', density = 'soft' }, ref) => {
  return (
    <div 
      className={`page bg-[#fffcf7] shadow-md overflow-hidden relative ${className}`} 
      ref={ref} 
      data-density={density}
    >
      <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between select-none">
        {children}
      </div>
    </div>
  );
});
Page.displayName = 'Page';

export default function RealFlipBook({ memories = [], onDelete }) {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synthesize realistic paper rustle sound using Web Audio API
  const playPageTurnSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (bufferSize * 0.25));
        data[i] = (Math.random() * 2 - 1) * decay * 0.15;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Ignore audio block policy warnings
    }
  }, [soundEnabled]);

  const onPageChange = useCallback((e) => {
    setCurrentPage(e.data);
    playPageTurnSound();
  }, [playPageTurnSound]);

  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  // Keyboard Navigation (Arrow Keys)
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
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Control Bar Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-pastel-pink/30 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pastel-lavender/20 text-pastel-lavender-dark flex items-center justify-center font-bold text-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm text-pastel-lavender-dark">
              Buku Kenangan Interactive 📖
            </h3>
            <p className="text-[11px] text-pastel-text/70 font-medium">
              Tarik atau klik sudut halaman untuk membalik seperti buku asli!
            </p>
          </div>
        </div>

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
              if (bookRef.current) {
                bookRef.current.pageFlip().flip(0);
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

      {/* HTML5 REAL PAGEFLIP CONTAINER STAGE */}
      <div className="flex justify-center items-center py-2 sm:py-4 overflow-hidden">
        <HTML5FlipBook
          width={380}
          height={520}
          size="stretch"
          minWidth={280}
          maxWidth={450}
          minHeight={420}
          maxHeight={600}
          maxShadowOpacity={0.6}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onPageChange}
          ref={bookRef}
          className="shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* FRONT COVER */}
          <Page density="hard" className="bg-gradient-to-br from-[#f8ece1] via-[#fff5eb] to-[#fce4ec] border-4 border-dashed border-pastel-pink/40">
            <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
              <div className="washi-tape px-4 py-1 rounded-sm text-[11px] font-headline font-bold text-pastel-pink-dark shadow-sm">
                2nd Anniversary Scrapbook
              </div>

              <div className="w-16 h-16 rounded-full bg-white border-4 border-pastel-pink shadow-sticker flex items-center justify-center my-2">
                <Heart className="w-8 h-8 fill-pastel-pink text-pastel-pink animate-pulse" />
              </div>

              <span className="px-3 py-0.5 rounded-full bg-white text-pastel-pink-dark font-headline font-extrabold text-[10px] border border-pastel-pink/40 shadow-sm">
                📖 ALBUM KENANGAN REAL
              </span>

              <h1 className="font-headline font-black text-2xl sm:text-3xl text-pastel-lavender-dark leading-tight">
                Lesmana & Nafla
              </h1>

              <p className="font-handwriting text-xl sm:text-2xl text-pastel-pink-dark">
                "730 Hari Penuh Cinta & Momen Manis"
              </p>

              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-pastel-text/80 bg-white/90 px-3 py-1.5 rounded-xl border border-pastel-pink/30 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-pastel-lavender" />
                <span>8 Sep 2024 – 8 Sep 2026</span>
              </div>

              <p className="text-[10px] font-headline font-bold text-pastel-lavender-dark bg-pastel-lavender/20 px-3 py-1 rounded-full animate-bounce">
                👉 Klik & Tarik Sudut Halaman Untuk Membuka
              </p>
            </div>
          </Page>

          {/* MEMORIES PAGES (2 pages per memory: Photo Page & Story Page) */}
          {memories.map((mem, idx) => [
            /* LEFT PAGE: PHOTO & DETAILS */
            <Page key={`mem-photo-${mem.id || idx}`} density="soft" className="bg-[#fffbf5] border-r border-dashed border-pastel-pink/30">
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="washi-tape-pink px-3 py-0.5 rounded-sm text-[10px] font-headline font-bold text-pastel-pink-dark">
                    {mem.category?.toUpperCase() || 'MEMORY'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-pastel-lavender-dark">
                    Momen #{idx + 1}
                  </span>
                </div>

                {/* POLAROID FRAME */}
                <div className="bg-white p-3 rounded-xl shadow-polaroid border border-gray-200 transform -rotate-1 my-auto">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-2 border border-gray-200">
                    <img
                      src={mem.photo || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-headline font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pastel-pink" />
                      <span className="truncate max-w-[120px]">{mem.location || 'Lokasi Kencan'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-pastel-lavender-dark">
                      <Calendar className="w-3 h-3 text-pastel-pink" />
                      <span>{mem.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(mem.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-center font-mono font-bold text-pastel-text/60">
                  - Hal. {idx * 2 + 1} -
                </div>
              </div>
            </Page>,

            /* RIGHT PAGE: HANDWRITTEN MEMO & STORY */
            <Page key={`mem-story-${mem.id || idx}`} density="soft" className="bg-[#fffcf7]">
              <div className="flex flex-col justify-between h-full space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-pastel-pink-dark bg-pastel-pink/15 px-2 py-0.5 rounded-full border border-pastel-pink/30">
                      📖 Catatan Cerita
                    </span>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(mem.id)}
                        className="text-[9px] text-rose-500 hover:underline font-bold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <h3 className="font-headline font-extrabold text-lg text-pastel-lavender-dark leading-snug mb-2">
                    {mem.title}
                  </h3>

                  <div className="bg-white/90 p-4 rounded-xl border border-pastel-pink/20 shadow-sm relative min-h-[160px]">
                    <p className="font-handwriting text-xl text-slate-700 leading-relaxed">
                      "{mem.story || 'Tidak ada catatan cerita untuk momen ini.'}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-pastel-pink/20 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-pastel-text/70">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Lesmana & Nafla Scrapbook</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-pastel-text/60">
                    - Hal. {idx * 2 + 2} -
                  </span>
                </div>
              </div>
            </Page>
          ]).flat()}

          {/* BACK COVER */}
          <Page density="hard" className="bg-gradient-to-br from-[#fcf4ec] via-[#f8e8ee] to-[#edf2ff] border-4 border-dashed border-pastel-lavender/40">
            <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-pastel-lavender shadow-sticker flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-pastel-lavender-dark" />
              </div>

              <h2 className="font-headline font-black text-2xl text-pastel-lavender-dark">
                Penutup & Harapan 💕
              </h2>

              <p className="font-handwriting text-xl text-slate-700 max-w-xs leading-relaxed">
                "Terima kasih telah menemani dan mengukir setiap kenangan indah ini. Semoga perjalanan tahun ke-3 kita semakin manis!"
              </p>

              <div className="px-3 py-1 rounded-full bg-white text-pastel-pink-dark font-headline font-bold text-[10px] border border-pastel-pink/40 shadow-sm">
                Total {memories.length} Momen Indah Tersimpan
              </div>
            </div>
          </Page>
        </HTML5FlipBook>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-pastel-pink/30 shadow-sm flex items-center justify-between gap-3">
        <button
          onClick={goToPrevPage}
          className="px-4 py-2 rounded-xl bg-pastel-surface hover:bg-pastel-pink/20 text-pastel-lavender-dark border border-pastel-pink/30 font-headline font-bold text-xs flex items-center gap-1.5 transition-all btn-squish"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Page</span>
        </button>

        <div className="text-xs font-mono font-bold text-pastel-lavender-dark bg-pastel-lavender/10 px-4 py-1.5 rounded-full border border-pastel-lavender/30">
          Tarik Ujung Halaman Untuk Membalik 📖
        </div>

        <button
          onClick={goToNextPage}
          className="px-4 py-2 rounded-xl bg-pastel-lavender text-white font-headline font-bold text-xs flex items-center gap-1.5 transition-all shadow-squish hover:scale-105 btn-squish"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
