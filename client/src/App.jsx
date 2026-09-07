import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import Vouchers from './pages/Vouchers';
import Letter from './pages/Letter';
import Quiz from './pages/Quiz';
import Admin from './pages/Admin';
import Login from './pages/Login';

import {
  fetchConfig,
  fetchMemories,
  fetchVouchers,
  fetchWishlist,
  fetchQuiz,
  fetchLetter,
  claimVoucher,
  resetVouchers,
  toggleWish,
  addWish,
  deleteMemory
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Application Data States
  const [config, setConfig] = useState(null);
  const [memories, setMemories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check URL path or sessionStorage for initial tab
  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }

    const path = window.location.pathname.toLowerCase();
    if (path === '/login' || window.location.hash === '#login') {
      setActiveTab('login');
    } else if (path === '/admin' || window.location.hash === '#admin') {
      setActiveTab(token ? 'admin' : 'login');
    }
  }, []);

  const loadAllData = async () => {
    try {
      const [cfgRes, memRes, vouchRes, wishRes, quizRes, letRes] = await Promise.all([
        fetchConfig().catch(() => ({ success: false })),
        fetchMemories().catch(() => ({ success: false })),
        fetchVouchers().catch(() => ({ success: false })),
        fetchWishlist().catch(() => ({ success: false })),
        fetchQuiz().catch(() => ({ success: false })),
        fetchLetter().catch(() => ({ success: false }))
      ]);

      if (cfgRes.success) setConfig(cfgRes.data);
      if (memRes.success) setMemories(memRes.data);
      if (vouchRes.success) setVouchers(vouchRes.data);
      if (wishRes.success) setWishlist(wishRes.data);
      if (quizRes.success) setQuiz(quizRes.data);
      if (letRes.success) setLetter(letRes.data);
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === 'admin' && !isAuthenticated) {
      setActiveTab('login');
      window.history.pushState({}, '', '/login');
      return;
    }
    setActiveTab(tabId);
    if (tabId === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (tabId === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('admin');
    window.history.pushState({}, '', '/admin');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setActiveTab('home');
    window.history.pushState({}, '', '/');
  };

  const handleClaimVoucher = async (id) => {
    await claimVoucher(id);
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, claimed: true } : v));
  };

  const handleResetVouchers = async () => {
    await resetVouchers();
    setVouchers(prev => prev.map(v => ({ ...v, claimed: false })));
  };

  const handleToggleWish = async (id) => {
    await toggleWish(id);
    setWishlist(prev => prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const handleAddWish = async (newWish) => {
    const res = await addWish(newWish);
    if (res.success) {
      setWishlist(prev => [...prev, res.data]);
    }
  };

  const handleDeleteMemory = async (id) => {
    if (window.confirm("Yakin ingin menghapus kenangan ini?")) {
      await deleteMemory(id);
      setMemories(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf5] flex flex-col font-body selection:bg-pastel-pink selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pastel-lavender-dark">
            <div className="w-12 h-12 rounded-full border-4 border-pastel-pink border-t-transparent animate-spin mb-4" />
            <p className="font-headline font-bold text-sm">Memuat Scrapbook Lesmana & Bebe...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <Home
                config={config}
                memories={memories}
                wishlist={wishlist}
                onToggleWish={handleToggleWish}
                onAddWish={handleAddWish}
                onNavigate={handleTabChange}
              />
            )}
            {activeTab === 'timeline' && (
              <Timeline
                memories={memories}
                onDeleteMemory={handleDeleteMemory}
                onOpenAdmin={() => handleTabChange('admin')}
              />
            )}
            {activeTab === 'vouchers' && (
              <Vouchers
                vouchers={vouchers}
                onClaim={handleClaimVoucher}
                onReset={handleResetVouchers}
              />
            )}
            {activeTab === 'letter' && (
              <Letter
                letter={letter}
                config={config}
              />
            )}
            {activeTab === 'quiz' && (
              <Quiz
                questions={quiz}
              />
            )}
            {activeTab === 'login' && (
              <Login
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => handleTabChange('home')}
              />
            )}
            {activeTab === 'admin' && isAuthenticated && (
              <Admin
                config={config}
                memories={memories}
                vouchers={vouchers}
                wishlist={wishlist}
                quiz={quiz}
                letter={letter}
                onRefreshData={loadAllData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
