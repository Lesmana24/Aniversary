import React, { useState } from 'react';
import { X, Save, Plus, RefreshCw, Settings, Sparkles } from 'lucide-react';
import { addMemory, resetVouchers, updateLetter } from '../services/api';

export default function AdminDrawer({ isOpen, onClose, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('memory');

  // Form states for memory
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Cafe');
  const [photo, setPhoto] = useState('');
  const [story, setStory] = useState('');

  // Form states for letter
  const [letterContent, setLetterContent] = useState('');

  if (!isOpen) return null;

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addMemory({ title, date, location, category, photo, story, rating: 5 });
    setTitle('');
    setLocation('');
    setStory('');
    setPhoto('');
    onRefreshData();
    alert('✨ Kenangan kencan berhasil ditambahkan ke scrapbook!');
  };

  const handleResetVouchers = async () => {
    if (window.confirm('Reset semua kartu gosok agar bisa digosok ulang?')) {
      await resetVouchers();
      onRefreshData();
      alert('🎟️ Semua voucher kartu gosok telah di-reset!');
    }
  };

  const handleUpdateLetter = async (e) => {
    e.preventDefault();
    if (!letterContent.trim()) return;
    await updateLetter({ content: letterContent });
    onRefreshData();
    alert('💌 Isi surat cinta berhasil diperbarui!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-pastel-lavender/40 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-pastel-lavender/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pastel-lavender text-white flex items-center justify-center shadow-sticker">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-extrabold text-lg text-pastel-lavender-dark">
                Studio CMS Bebe (2nd Anniversary)
              </h3>
              <p className="text-[11px] text-pastel-text/70">Kelola & Edit Konten Scrapbook Realtime</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-pastel-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex-1 py-2 rounded-xl font-headline font-bold text-xs border-2 transition-all ${
              activeTab === 'memory'
                ? 'bg-pastel-lavender text-white border-pastel-lavender shadow-squish'
                : 'bg-pastel-canvas text-pastel-text border-pastel-pink/30 hover:bg-pastel-surface'
            }`}
          >
            + Kenangan Kencan
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`flex-1 py-2 rounded-xl font-headline font-bold text-xs border-2 transition-all ${
              activeTab === 'letter'
                ? 'bg-pastel-lavender text-white border-pastel-lavender shadow-squish'
                : 'bg-pastel-canvas text-pastel-text border-pastel-pink/30 hover:bg-pastel-surface'
            }`}
          >
            Edit Surat Cinta
          </button>
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex-1 py-2 rounded-xl font-headline font-bold text-xs border-2 transition-all ${
              activeTab === 'vouchers'
                ? 'bg-pastel-lavender text-white border-pastel-lavender shadow-squish'
                : 'bg-pastel-canvas text-pastel-text border-pastel-pink/30 hover:bg-pastel-surface'
            }`}
          >
            Reset Voucher
          </button>
        </div>

        {/* Tab 1: Memory */}
        {activeTab === 'memory' && (
          <form onSubmit={handleAddMemory} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-pastel-text mb-1">Judul Momen Kencan</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Gelato Walk & Berburu Vinyl di Blok M"
                className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text focus:outline-none focus:ring-2 focus:ring-pastel-lavender"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-pastel-text mb-1">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-pastel-text mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                >
                  <option value="Cafe">Cafe & Kopi</option>
                  <option value="Outdoor">Outdoor & Taman</option>
                  <option value="Trip">Trip & Jalan-jalan</option>
                  <option value="Movie">Movie & Entertainment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-pastel-text mb-1">Lokasi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Blok M Jakarta"
                className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-pastel-text mb-1">URL Foto Polaroid (Unsplash/Imgur/Firebase)</label>
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-pastel-text mb-1">Cerita Memo Manis</label>
              <textarea
                rows="3"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Tuliskan momen lucu atau kata manis dari kenangan ini..."
                className="w-full px-3 py-2 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Kenangan Kencan Baru</span>
            </button>
          </form>
        )}

        {/* Tab 2: Letter */}
        {activeTab === 'letter' && (
          <form onSubmit={handleUpdateLetter} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-pastel-text mb-1">Ubah Pesan Surat Cinta</label>
              <textarea
                rows="6"
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Tuliskan ucapan dan isi surat cinta baru..."
                className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text leading-relaxed"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-pastel-pink-dark text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Surat</span>
            </button>
          </form>
        )}

        {/* Tab 3: Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-pastel-pink/20 text-pastel-pink-dark mx-auto flex items-center justify-center mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-headline font-bold text-sm text-pastel-text mb-1">
              Reset Semua Kartu Gosok
            </h4>
            <p className="text-xs text-pastel-text/70 mb-4 px-4">
              Semua status klaim kupon gosok akan dikembalikan ke kondisi belum tergosok.
            </p>
            <button
              onClick={handleResetVouchers}
              className="px-6 py-2.5 rounded-2xl bg-pastel-pink text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-105 active:scale-95 transition-all btn-squish"
            >
              Reset Kartu Gosok Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
