import React from 'react';
import { Heart, Calendar, Gift, Mail, Sparkles, BookOpen, Lock, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAuthenticated, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Heart },
    { id: 'timeline', label: 'Flip Book Kencan', icon: BookOpen },
    { id: 'vouchers', label: 'Kartu Gosok', icon: Gift },
    { id: 'letter', label: 'Surat & Lagu', icon: Mail },
    { id: 'quiz', label: 'Kuis Cinta', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#fffbf5]/90 backdrop-blur-md border-b-2 border-dashed border-[#e6e2dc] px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pastel-lavender to-pastel-pink flex items-center justify-center text-white shadow-sticker group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-extrabold text-lg text-pastel-lavender-dark">
                Lesmana & Nafla
              </span>
              <span className="bg-pastel-pink/20 text-pastel-pink-dark text-[10px] font-headline font-bold px-2 py-0.5 rounded-full border border-pastel-pink/40">
                2nd Aniv 💖
              </span>
            </div>
            <p className="text-xs text-pastel-text/70 flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-pastel-lavender" /> 8 Sep 2024 – 8 Sep 2026
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-headline text-xs font-bold transition-all whitespace-nowrap btn-squish ${
                  isActive
                    ? 'bg-pastel-lavender text-white shadow-squish'
                    : 'bg-pastel-surface/80 text-pastel-text hover:bg-pastel-pink/20 hover:text-pastel-pink-dark'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin Auth Status / Admin Studio Link */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-2xl font-headline text-xs font-bold transition-all border-2 flex items-center gap-1 btn-squish ${
                  activeTab === 'admin'
                    ? 'bg-pastel-pink text-white border-pastel-pink shadow-squish-pink'
                    : 'bg-white border-pastel-pink/40 text-pastel-pink-dark hover:bg-pastel-pink/10'
                }`}
              >
                <span>⚙️ CMS Admin</span>
              </button>

              <button
                onClick={onLogout}
                title="Logout dari Session Admin"
                className="p-2 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              title="Portal Login khusus Lesmana Admin"
              className="p-2 rounded-2xl bg-white border-2 border-pastel-lavender/30 text-pastel-lavender-dark hover:bg-pastel-lavender hover:text-white transition-all btn-squish ml-1"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
