import React from 'react';
import ScratchCard from '../components/ScratchCard';
import { Gift, RefreshCw, Sparkles } from 'lucide-react';

export default function Vouchers({ vouchers, onClaim, onReset }) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pastel-pink/20 via-white to-pastel-surface rounded-3xl p-6 shadow-scrapbook border-2 border-dashed border-pastel-pink/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-pastel-pink/20 text-pastel-pink-dark text-xs font-headline font-bold px-3 py-1 rounded-full border border-pastel-pink/30 flex items-center gap-1 w-fit">
            <Gift className="w-3.5 h-3.5" /> SECRET COUPONS
          </span>
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-pastel-lavender-dark mt-2">
            Kartu Gosok Hadiah Rahasia 🎟️
          </h1>
          <p className="text-xs sm:text-sm text-pastel-text mt-1">
            Gosok permukaan foil emas/pink di bawah ini menggunakan jari atau mouse untuk membuka hadiah spesial untuk Bebe!
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2.5 rounded-2xl bg-white text-pastel-pink-dark border-2 border-pastel-pink/40 font-headline font-bold text-xs hover:bg-pastel-pink/10 transition-all btn-squish flex items-center gap-1.5 whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Kartu Gosok</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {vouchers && vouchers.map((v) => (
          <ScratchCard
            key={v.id}
            voucher={v}
            onClaim={onClaim}
          />
        ))}
      </div>
    </div>
  );
}
