import React, { useState } from 'react';
import { Heart, Send, Sparkles, Feather } from 'lucide-react';

export default function LoveLetter({ letter }) {
  const [hearts, setHearts] = useState([]);
  const [likeCount, setLikeCount] = useState(730);

  const triggerHeartReaction = () => {
    setLikeCount(prev => prev + 1);
    const newHeart = {
      id: Date.now() + Math.random(),
      left: Math.random() * 80 + 10,
    };
    setHearts(prev => [...prev, newHeart]);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1800);
  };

  const { sender, receiver, title, date, content } = letter || {};

  return (
    <div className="relative max-w-2xl mx-auto my-6">
      {/* Floating Hearts Particle Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {hearts.map(h => (
          <div
            key={h.id}
            className="absolute bottom-10 animate-float-up text-red-500 font-bold text-xl flex items-center gap-1"
            style={{ left: `${h.left}%` }}
          >
            <Heart className="w-6 h-6 fill-red-500 stroke-none" />
          </div>
        ))}
      </div>

      {/* Notebook Paper Container */}
      <div className="relative bg-[#fffdfa] rounded-2xl p-6 sm:p-10 shadow-scrapbook border border-amber-900/10 rotate-[-0.5deg]">
        {/* Washi Tape Corner Pin */}
        <div className="absolute -top-3 left-8 w-28 h-6 washi-tape-pink -rotate-3 z-10 flex items-center justify-center">
          <span className="text-[10px] font-headline font-bold text-pastel-pink-dark uppercase">
            Surat Untuk Nafla
          </span>
        </div>

        {/* Notebook Lines Background Effect */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
          style={{
            backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '100% 28px',
            marginTop: '60px'
          }}
        />

        {/* Letter Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-dashed border-pastel-pink/30 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-pastel-lavender-dark bg-pastel-surface px-2.5 py-1 rounded-full border border-pastel-lavender/30">
              💌 2nd Anniversary Special Letter
            </span>
            <h2 className="font-headline font-extrabold text-xl sm:text-2xl text-pastel-text mt-2">
              {title || "Surat Cinta 730 Hari Bersama"}
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-pastel-text/70">
            <span>📅 {date || "8 September 2026"}</span>
          </div>
        </div>

        {/* Receiver Greeting */}
        <div className="relative z-10 mb-4 font-headline font-bold text-lg text-pastel-pink-dark">
          Untuk {receiver || "Nafla Sayang"},
        </div>

        {/* Letter Content Body */}
        <div className="relative z-10 text-sm sm:text-base text-pastel-text leading-relaxed whitespace-pre-line font-body mb-8 font-medium">
          {content || "Terima kasih sudah berjalan 730 hari penuh cinta bersama Lesmana."}
        </div>

        {/* Sender Sign-off */}
        <div className="relative z-10 flex justify-end mb-6">
          <div className="text-right">
            <p className="text-xs text-pastel-text/70 font-medium">Dengan Sepenuh Hati,</p>
            <p className="font-headline font-extrabold text-lg text-pastel-lavender-dark mt-1 flex items-center gap-1.5 justify-end">
              <Feather className="w-4 h-4 text-pastel-pink" />
              {sender || "Lesmana"}
            </p>
          </div>
        </div>

        {/* Interactive Heart Reaction Footer */}
        <div className="relative z-10 border-t border-dashed border-pastel-pink/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-medium text-pastel-text/80 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pastel-lavender" />
            <span>Kirim rasa cinta & pelukan hangat ke Lesmana</span>
          </div>

          <button
            onClick={triggerHeartReaction}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pastel-pink to-rose-400 text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-105 active:scale-95 transition-all btn-squish"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Kirim Pelukan Hangat ({likeCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
