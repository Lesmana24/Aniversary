import React, { useState, useEffect } from 'react';
import PolaroidCard from '../components/PolaroidCard';
import WishlistCard from '../components/WishlistCard';
import { Heart, Calendar, Clock, Sparkles, BookOpen, Gift, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home({ config, memories, wishlist, onToggleWish, onAddWish, onNavigate }) {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 730,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Auto-play slideshow for hero header Polaroid card (rotates every 4 seconds)
  useEffect(() => {
    if (!memories || memories.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % memories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [memories]);

  // Keep active index bounded if memories array updates
  useEffect(() => {
    if (memories && memories.length > 0 && currentHeroIndex >= memories.length) {
      setCurrentHeroIndex(0);
    }
  }, [memories, currentHeroIndex]);

  useEffect(() => {
    const startDate = new Date(config?.startDate || '2024-09-08T00:00:00.000Z');

    const updateCounter = () => {
      const now = new Date();
      const diff = now - startDate;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [config]);

  const activeMemory = memories && memories.length > 0
    ? memories[currentHeroIndex % memories.length]
    : {
        id: 'cover-1',
        title: 'Lesmana & Nafla 2nd Anniversary',
        date: '8 September 2026',
        location: 'Di mana pun Bersama Nafla',
        category: 'SPECIAL',
        photo: config?.coverPhoto || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        story: '730 hari penuh cinta, tawa, dan kenangan indah tak terlupakan.',
        rating: 5
      };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Scrapbook Banner */}
      <section className="relative bg-gradient-to-r from-pastel-pink/30 via-pastel-surface to-pastel-lavender/30 rounded-3xl p-6 sm:p-10 border-2 border-dashed border-pastel-pink/40 shadow-scrapbook overflow-hidden">
        {/* Floating Y2K Decorator Badges */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-headline font-bold text-pastel-pink-dark border border-pastel-pink/40 shadow-sticker hidden sm:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pastel-pink" /> 2 Years of Love & Joy
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title & Live Love Counter */}
          <div className="md:col-span-7 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-pink/20 text-pastel-pink-dark font-headline font-bold text-xs border border-pastel-pink/30">
              <Heart className="w-3.5 h-3.5 fill-pastel-pink text-pastel-pink animate-pulse" />
              <span>Anniversary Scrapbook Lesmana & Nafla</span>
            </div>

            <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-pastel-lavender-dark leading-tight">
              730 Hari Penuh Cinta & Tawa 💕
            </h1>

            <p className="text-sm sm:text-base text-pastel-text leading-relaxed font-medium">
              {config?.subtitle || "Perjalanan 2 tahun indah Lesmana dan Nafla. Mari mengenang momen kencan, membuka kartu gosok, dan mendengarkan lagu spesial."}
            </p>

            {/* Live Counter Cards Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-pastel-pink/30 text-center shadow-sm">
                <span className="block font-headline font-black text-xl sm:text-2xl text-pastel-lavender-dark">
                  {timeElapsed.days}
                </span>
                <span className="text-[10px] font-mono font-bold text-pastel-text/70 uppercase">Hari</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-pastel-pink/30 text-center shadow-sm">
                <span className="block font-headline font-black text-xl sm:text-2xl text-pastel-pink-dark">
                  {timeElapsed.hours}
                </span>
                <span className="text-[10px] font-mono font-bold text-pastel-text/70 uppercase">Jam</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-pastel-pink/30 text-center shadow-sm">
                <span className="block font-headline font-black text-xl sm:text-2xl text-pastel-lavender-dark">
                  {timeElapsed.minutes}
                </span>
                <span className="text-[10px] font-mono font-bold text-pastel-text/70 uppercase">Menit</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-pastel-pink/30 text-center shadow-sm">
                <span className="block font-headline font-black text-xl sm:text-2xl text-pastel-pink-dark">
                  {timeElapsed.seconds}
                </span>
                <span className="text-[10px] font-mono font-bold text-pastel-text/70 uppercase">Detik</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('timeline')}
                className="px-5 py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-105 active:scale-95 transition-all btn-squish flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Flip Book Kencan</span>
              </button>
              <button
                onClick={() => onNavigate('vouchers')}
                className="px-5 py-3 rounded-2xl bg-white text-pastel-pink-dark border-2 border-pastel-pink/40 font-headline font-bold text-xs hover:bg-pastel-pink/10 transition-all btn-squish flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                <span>Gosok Kartu Hadiah</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Polaroid Slideshow */}
          <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
            <div
              onClick={() => onNavigate('timeline')}
              className="max-w-xs w-full cursor-pointer relative group transition-all duration-300 transform hover:scale-105"
              title="Klik untuk membuka Flip Book Kencan"
            >
              {/* Slideshow Counter Badge */}
              {memories && memories.length > 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-pastel-pink-dark text-white text-[10px] font-headline font-bold px-3 py-0.5 rounded-full shadow-md border-2 border-white animate-bounce flex items-center gap-1">
                  <span>Momen {currentHeroIndex + 1} dari {memories.length} 💖</span>
                </div>
              )}

              {/* Animated Polaroid Display */}
              <div key={activeMemory?.id || currentHeroIndex} className="animate-fadeIn">
                <PolaroidCard memory={activeMemory} rotateDegree="rotate-2" />
              </div>
            </div>

            {/* Interactive Carousel Dots & Arrow Controls */}
            {memories && memories.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + memories.length) % memories.length)}
                  className="w-7 h-7 rounded-full bg-white text-pastel-lavender-dark hover:bg-pastel-lavender hover:text-white border border-pastel-pink/30 flex items-center justify-center text-xs font-bold transition-all shadow-sm active:scale-95"
                  title="Kenangan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-pastel-pink/30 shadow-sm">
                  {memories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentHeroIndex
                          ? 'w-6 bg-pastel-pink-dark'
                          : 'w-2 bg-pastel-pink/40 hover:bg-pastel-pink'
                      }`}
                      title={`Ke Momen ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % memories.length)}
                  className="w-7 h-7 rounded-full bg-white text-pastel-lavender-dark hover:bg-pastel-lavender hover:text-white border border-pastel-pink/30 flex items-center justify-center text-xs font-bold transition-all shadow-sm active:scale-95"
                  title="Kenangan Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid Section: Memories Preview & Year 3 Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Memories Teaser */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pastel-pink" />
              <span>Kenangan Kencan Terkini</span>
            </h2>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs font-headline font-bold text-pastel-pink-dark hover:underline flex items-center gap-1"
            >
              Lihat Semua ({memories?.length || 0}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories && memories.slice(0, 2).map((m, idx) => (
              <PolaroidCard
                key={m.id}
                memory={m}
                rotateDegree={idx % 2 === 0 ? '-rotate-1' : 'rotate-2'}
              />
            ))}
          </div>
        </div>

        {/* Impian Tahun Ke-3 Checklist */}
        <div className="lg:col-span-5">
          <WishlistCard
            items={wishlist}
            onToggle={onToggleWish}
            onAdd={onAddWish}
          />
        </div>
      </div>
    </div>
  );
}
