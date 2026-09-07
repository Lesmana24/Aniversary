import React, { useRef, useEffect, useState } from 'react';
import { Gift, CheckCircle, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScratchCard({ voucher, onClaim }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(voucher.claimed || false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (voucher.claimed) {
      setIsRevealed(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fill with glossy Y2K gradient scratch foil
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#c084fc');
    gradient.addColorStop(0.5, '#e879f9');
    gradient.addColorStop(1, '#f472b6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add sparkling overlay text on foil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Epilogue, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ GOSOK DI SINI UNTUK BUKA HADIAH ✨', width / 2, height / 2 - 5);

    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText('🎁 Hadiah Spesial 2 Year Anniversary', width / 2, height / 2 + 18);
  }, [voucher]);

  const checkScratchPercentage = (ctx, canvas) => {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const percent = (transparentPixels / (pixels.length / 4)) * 100;
      setScratchPercent(Math.round(percent));

      if (percent > 45 && !isRevealed) {
        setIsRevealed(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        if (onClaim) onClaim(voucher.id);
      }
    } catch (e) {
      console.warn("Scratch canvas calculation error:", e);
    }
  };

  const scratch = (e) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage(ctx, canvas);
  };

  return (
    <div className="relative bg-white rounded-2xl p-5 shadow-scrapbook border-2 border-dashed border-pastel-pink/50 flex flex-col justify-between hover:border-pastel-lavender transition-all">
      {/* Badge Ribbon */}
      <div className="flex items-center justify-between mb-3">
        <span className="bg-pastel-pink/20 text-pastel-pink-dark text-xs font-headline font-bold px-2.5 py-1 rounded-full border border-pastel-pink/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-pastel-pink" />
          {voucher.badge || 'Anniversary Coupon'}
        </span>
        {isRevealed ? (
          <span className="text-emerald-600 font-headline font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Terklaim
          </span>
        ) : (
          <span className="text-pastel-lavender-dark text-xs font-bold font-mono">
            {scratchPercent > 0 ? `${scratchPercent}% tergosok` : '🔒 Terkunci'}
          </span>
        )}
      </div>

      {/* Voucher Content Behind Canvas */}
      <div className="my-2 p-4 rounded-xl bg-pastel-canvas border border-pastel-pink/20 text-center relative overflow-hidden">
        <Gift className="w-8 h-8 text-pastel-lavender mx-auto mb-2 opacity-80" />
        <h3 className="font-headline font-extrabold text-base text-pastel-lavender-dark mb-1">
          {voucher.title}
        </h3>
        <p className="text-xs text-pastel-text leading-relaxed font-medium mb-3">
          {voucher.description}
        </p>

        <div className="inline-block bg-white px-3 py-1.5 rounded-lg border border-dashed border-pastel-lavender font-mono text-xs font-bold text-pastel-text tracking-wider">
          KODE: <span className="text-pastel-pink-dark">{voucher.code}</span>
        </div>

        <p className="text-[10px] text-pastel-text/60 mt-2 italic font-medium">
          {voucher.expiry}
        </p>

        {/* Scratch Canvas Overlay */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={320}
            height={160}
            onMouseDown={() => (isDrawingRef.current = true)}
            onMouseUp={() => (isDrawingRef.current = false)}
            onMouseMove={(e) => isDrawingRef.current && scratch(e)}
            onTouchStart={() => (isDrawingRef.current = true)}
            onTouchEnd={() => (isDrawingRef.current = false)}
            onTouchMove={(e) => isDrawingRef.current && scratch(e)}
            className="absolute inset-0 w-full h-full rounded-xl cursor-pointer touch-none z-10"
          />
        )}
      </div>

      {/* Action footer */}
      <div className="mt-2 flex items-center justify-between text-xs text-pastel-text/70">
        <span>Kupon Spesial Lesmana & Bebe</span>
        {isRevealed && (
          <span className="font-headline font-bold text-pastel-pink-dark">
            ❤️ Tunjukkan ke Lesmana
          </span>
        )}
      </div>
    </div>
  );
}
