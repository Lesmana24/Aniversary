import React, { useState } from 'react';
import { Lock, User, KeyRound, Sparkles, Heart, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/api';

export default function Login({ onLoginSuccess, onNavigateHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await loginAdmin({ username, password });
      if (res.success) {
        sessionStorage.setItem('adminToken', res.token);
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-scrapbook border-4 border-pastel-lavender/40 max-w-md w-full relative overflow-hidden">
        {/* Washi Tape Header Pin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-pink -rotate-1 z-10 flex items-center justify-center">
          <span className="text-[10px] font-headline font-bold text-pastel-pink-dark uppercase tracking-widest">
            ADMIN LOGIN
          </span>
        </div>

        {/* Header Icon */}
        <div className="text-center space-y-2 mt-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pastel-lavender to-pastel-pink text-white mx-auto flex items-center justify-center shadow-sticker">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-headline font-extrabold text-2xl text-pastel-lavender-dark">
            Portal Studio Admin 🔒
          </h1>
          <p className="text-xs text-pastel-text font-medium">
            Masukan kredensial Lesmana untuk mengelola isi Scrapbook.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-medium flex items-center gap-2 mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-pastel-text mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-pastel-lavender" /> Username Admin
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: lesmana"
              className="w-full p-3.5 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pastel-text mb-1 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-pastel-pink" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3.5 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-pastel-lavender text-white font-headline font-extrabold text-sm shadow-squish hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Ke Dashboard Admin ➔</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Client View Link */}
        <div className="mt-6 pt-4 border-t border-dashed border-pastel-pink/30 text-center">
          <button
            onClick={onNavigateHome}
            className="text-xs font-headline font-bold text-pastel-pink-dark hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali Ke Tampilan Scrapbook Client
          </button>
        </div>
      </div>
    </div>
  );
}
