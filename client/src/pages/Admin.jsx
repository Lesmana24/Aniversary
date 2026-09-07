import React, { useState } from 'react';
import {
  Settings,
  Heart,
  BookOpen,
  Gift,
  Mail,
  Sparkles,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  Loader2,
  Calendar,
  MapPin,
  HelpCircle,
  Clock
} from 'lucide-react';

import {
  updateConfig,
  addMemory,
  deleteMemory,
  resetVouchers,
  updateLetter,
  addWish,
  uploadImage
} from '../services/api';

export default function Admin({
  config,
  memories,
  vouchers,
  wishlist,
  quiz,
  letter,
  onRefreshData
}) {
  const [adminTab, setAdminTab] = useState('beranda');
  const [notification, setNotification] = useState('');

  // Beranda Config Form State
  const [configTitle, setConfigTitle] = useState(config?.title || 'Lesmana & Nafla 2nd Anniversary');
  const [configSubtitle, setConfigSubtitle] = useState(config?.subtitle || '');
  const [coverPhoto, setCoverPhoto] = useState(config?.coverPhoto || '');
  const [partner1, setPartner1] = useState(config?.partner1 || 'Lesmana');
  const [partner2, setPartner2] = useState(config?.partner2 || 'Nafla (Bebe)');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // New Memory Form State
  const [memTitle, setMemTitle] = useState('');
  const [memDate, setMemDate] = useState(new Date().toISOString().split('T')[0]);
  const [memLocation, setMemLocation] = useState('');
  const [memCategory, setMemCategory] = useState('Cafe');
  const [memPhoto, setMemPhoto] = useState('');
  const [memStory, setMemStory] = useState('');
  const [isUploadingMemPhoto, setIsUploadingMemPhoto] = useState(false);

  // Letter Form State
  const [letterTitle, setLetterTitle] = useState(letter?.title || '');
  const [letterSender, setLetterSender] = useState(letter?.sender || 'Lesmana');
  const [letterReceiver, setLetterReceiver] = useState(letter?.receiver || 'Nafla (Bebe) Sayang');
  const [letterContent, setLetterContent] = useState(letter?.content || '');
  const [audioUrl, setAudioUrl] = useState(letter?.audioUrl || '');
  const [audioDuration, setAudioDuration] = useState(letter?.audioDuration || '02:30');

  // New Wish State
  const [wishTitle, setWishTitle] = useState('');
  const [wishCategory, setWishCategory] = useState('Outdoor');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Upload Cover Photo File Handler
  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setCoverPhoto(url);
        showToast('📸 Foto cover berhasil diunggah!');
      }
    } catch (err) {
      alert('Gagal mengunggah foto: ' + err.message);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload Memory Photo File Handler
  const handleMemFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMemPhoto(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setMemPhoto(url);
        showToast('📸 Foto kenangan berhasil diunggah!');
      }
    } catch (err) {
      alert('Gagal mengunggah foto: ' + err.message);
    } finally {
      setIsUploadingMemPhoto(false);
    }
  };

  // 1. Save Beranda Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    await updateConfig({
      title: configTitle,
      subtitle: configSubtitle,
      coverPhoto,
      partner1,
      partner2
    });
    onRefreshData();
    showToast('✨ Pengaturan Beranda berhasil disimpan!');
  };

  // 2. Save New Memory
  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!memTitle.trim()) return;
    await addMemory({
      title: memTitle,
      date: memDate,
      location: memLocation,
      category: memCategory,
      photo: memPhoto || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      story: memStory,
      rating: 5
    });
    setMemTitle('');
    setMemLocation('');
    setMemStory('');
    setMemPhoto('');
    onRefreshData();
    showToast('📖 Kenangan kencan baru berhasil ditambahkan!');
  };

  // 3. Delete Memory
  const handleDeleteMem = async (id) => {
    if (window.confirm('Hapus kenangan kencan ini?')) {
      await deleteMemory(id);
      onRefreshData();
      showToast('🗑️ Kenangan kencan dihapus');
    }
  };

  // 4. Save Letter
  const handleSaveLetter = async (e) => {
    e.preventDefault();
    await updateLetter({
      title: letterTitle,
      sender: letterSender,
      receiver: letterReceiver,
      content: letterContent,
      audioUrl,
      audioDuration
    });
    onRefreshData();
    showToast('💌 Surat Cinta & Audio Voice Note diperbarui!');
  };

  // 5. Reset Vouchers
  const handleResetVouchers = async () => {
    if (window.confirm('Reset semua kupon kartu gosok agar bisa digosok ulang?')) {
      await resetVouchers();
      onRefreshData();
      showToast('🎟️ Semua voucher kartu gosok berhasil di-reset!');
    }
  };

  // 6. Add Wish Item
  const handleAddWishItem = async (e) => {
    e.preventDefault();
    if (!wishTitle.trim()) return;
    await addWish({ title: wishTitle, category: wishCategory, priority: 'High' });
    setWishTitle('');
    onRefreshData();
    showToast('🌟 Impian baru berhasil ditambahkan!');
  };

  const tabs = [
    { id: 'beranda', label: '🏠 Edit Beranda', desc: 'Judul, Foto Cover & Impian' },
    { id: 'timeline', label: '📖 Edit Flip Book', desc: 'Daftar Kenangan Kencan' },
    { id: 'vouchers', label: '🎟️ Kartu Gosok', desc: 'Voucher & Reset Hadiah' },
    { id: 'letter', label: '💌 Surat & Suara', desc: 'Pesan Suara & Teks Surat' },
    { id: 'quiz', label: '💡 Kuis Trivia', desc: 'Preview Soal Trivia Cinta' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-pastel-pink-dark text-white px-5 py-3 rounded-2xl shadow-xl font-headline font-bold text-xs flex items-center gap-2 border-2 border-white animate-bounce">
          <CheckCircle className="w-4 h-4 text-pastel-custard" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Dashboard Header */}
      <div className="bg-gradient-to-r from-pastel-lavender/30 via-white to-pastel-pink/30 rounded-3xl p-6 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pastel-lavender to-pastel-pink text-white flex items-center justify-center shadow-sticker">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="bg-pastel-pink/20 text-pastel-pink-dark text-xs font-headline font-bold px-3 py-0.5 rounded-full border border-pastel-pink/30">
              STUDIO CMS DASHBOARD
            </span>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-pastel-lavender-dark mt-1">
              Admin CMS Editor Scrapbook ⚙️
            </h1>
            <p className="text-xs sm:text-sm text-pastel-text mt-0.5 font-medium">
              Panel Pengeditan Konten Lengkap untuk Lesmana & Bebe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-pastel-pink/30 text-xs font-mono font-bold text-emerald-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Sync Status: REALTIME OK</span>
        </div>
      </div>

      {/* Main Dashboard Layout: Sidebar & Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-3xl p-4 shadow-scrapbook border-2 border-dashed border-pastel-pink/30">
            <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-pastel-lavender-dark mb-3 px-2">
              Pilih Halaman Yang Ingin Di-edit
            </h3>
            <div className="space-y-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAdminTab(t.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all border-2 flex items-center justify-between ${
                    adminTab === t.id
                      ? 'bg-pastel-lavender text-white border-pastel-lavender shadow-squish'
                      : 'bg-pastel-canvas text-pastel-text border-pastel-pink/20 hover:bg-pastel-surface hover:border-pastel-lavender/40'
                  }`}
                >
                  <div>
                    <span className="block font-headline font-extrabold text-sm">{t.label}</span>
                    <span className={`text-[11px] font-medium ${adminTab === t.id ? 'text-white/80' : 'text-pastel-text/60'}`}>
                      {t.desc}
                    </span>
                  </div>
                  <span className="text-xs">➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Active Content Panel */}
        <div className="lg:col-span-8">
          {/* PANEL 1: EDIT BERANDA */}
          {adminTab === 'beranda' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 space-y-6">
              <div className="border-b border-dashed border-pastel-pink/30 pb-3">
                <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
                  <span>🏠 Edit Halaman Beranda</span>
                </h2>
                <p className="text-xs text-pastel-text mt-0.5">Ubah judul utama, foto cover polaroid, dan daftar impian tahun ke-3.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Nama Pasangan 1</label>
                    <input
                      type="text"
                      value={partner1}
                      onChange={(e) => setPartner1(e.target.value)}
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Nama Pasangan 2</label>
                    <input
                      type="text"
                      value={partner2}
                      onChange={(e) => setPartner2(e.target.value)}
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Judul Utama Anniversary</label>
                  <input
                    type="text"
                    value={configTitle}
                    onChange={(e) => setConfigTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Sub-judul / Ucapan Sambutan</label>
                  <textarea
                    rows="2"
                    value={configSubtitle}
                    onChange={(e) => setConfigSubtitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                {/* Upload Foto Cover dari Device & URL */}
                <div className="p-4 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 space-y-3">
                  <label className="block text-xs font-bold text-pastel-text flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-pastel-lavender" /> Foto Cover Polaroid Beranda
                    </span>
                    {coverPhoto && (
                      <span className="text-[10px] text-emerald-600 font-bold font-mono">✓ Gambar Terpasang</span>
                    )}
                  </label>

                  {/* Device File Input */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer bg-white px-4 py-2.5 rounded-xl border-2 border-dashed border-pastel-pink/40 hover:border-pastel-lavender flex items-center justify-center gap-2 text-xs font-headline font-bold text-pastel-lavender-dark transition-all">
                      {isUploadingCover ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-pastel-pink" />
                          <span>Mengunggah Foto ke Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-pastel-pink" />
                          <span>📁 Pilih Foto dari HP / Perangkat</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        disabled={isUploadingCover}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview & URL fallback */}
                  {coverPhoto && (
                    <div className="flex items-center gap-3 pt-2">
                      <img src={coverPhoto} alt="Cover Preview" className="w-16 h-16 rounded-xl object-cover border-2 border-pastel-pink/40 shadow-sm" />
                      <input
                        type="text"
                        value={coverPhoto}
                        onChange={(e) => setCoverPhoto(e.target.value)}
                        placeholder="Atau tempelkan URL Foto..."
                        className="flex-1 p-2 rounded-xl bg-white border border-pastel-pink/30 text-[11px] font-mono text-pastel-text"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Beranda</span>
                </button>
              </form>

              {/* Add Wish Item Form */}
              <div className="pt-4 border-t border-dashed border-pastel-pink/30">
                <h3 className="font-headline font-bold text-sm text-pastel-pink-dark mb-3">
                  + Tambah Impian Baru (Year 3 Wishlist)
                </h3>
                <form onSubmit={handleAddWishItem} className="flex gap-2">
                  <input
                    type="text"
                    value={wishTitle}
                    onChange={(e) => setWishTitle(e.target.value)}
                    placeholder="Tuliskan impian baru berdua..."
                    className="flex-1 p-2.5 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-pastel-pink text-white font-headline font-bold text-xs shadow-squish-pink"
                  >
                    Tambah Impian
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PANEL 2: EDIT FLIP BOOK KENCAN */}
          {adminTab === 'timeline' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 space-y-6">
              <div className="border-b border-dashed border-pastel-pink/30 pb-3">
                <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
                  <span>📖 Edit Lembar Kenangan Kencan</span>
                </h2>
                <p className="text-xs text-pastel-text mt-0.5">Tambah kenangan kencan baru atau kelola daftar yang sudah ada.</p>
              </div>

              {/* Form Add Memory */}
              <form onSubmit={handleAddMemory} className="p-4 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 space-y-3">
                <h3 className="font-headline font-bold text-sm text-pastel-lavender-dark">
                  + Form Tambah Momen Kencan Baru
                </h3>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Judul Momen</label>
                  <input
                    type="text"
                    required
                    value={memTitle}
                    onChange={(e) => setMemTitle(e.target.value)}
                    placeholder="Contoh: Piknik GBK Senayan & Gelato Matcha"
                    className="w-full p-2.5 rounded-xl bg-white border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Tanggal Kencan</label>
                    <input
                      type="date"
                      value={memDate}
                      onChange={(e) => setMemDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Kategori</label>
                    <select
                      value={memCategory}
                      onChange={(e) => setMemCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    >
                      <option value="Cafe">Cafe & Kopi</option>
                      <option value="Outdoor">Outdoor & Taman</option>
                      <option value="Trip">Trip & Jalan-jalan</option>
                      <option value="Movie">Movie & Entertainment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Lokasi Kencan</label>
                  <input
                    type="text"
                    value={memLocation}
                    onChange={(e) => setMemLocation(e.target.value)}
                    placeholder="Contoh: GBK Jakarta Pusat"
                    className="w-full p-2.5 rounded-xl bg-white border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                {/* Upload Foto Polaroid dari Device & URL */}
                <div className="p-3.5 rounded-xl bg-white border border-pastel-pink/30 space-y-2">
                  <label className="block text-xs font-bold text-pastel-text flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-pastel-lavender" /> Foto Polaroid Momen
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer bg-pastel-canvas px-3 py-2 rounded-xl border border-dashed border-pastel-pink/40 hover:border-pastel-lavender flex items-center justify-center gap-2 text-xs font-headline font-bold text-pastel-lavender-dark transition-all">
                      {isUploadingMemPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-pastel-pink" />
                          <span>Mengunggah Foto ke Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-pastel-pink" />
                          <span>📁 Upload Foto dari Device</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMemFileChange}
                        disabled={isUploadingMemPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {memPhoto && (
                    <div className="flex items-center gap-2 pt-1">
                      <img src={memPhoto} alt="Memory Preview" className="w-12 h-12 rounded-lg object-cover border border-amber-900/10" />
                      <input
                        type="text"
                        value={memPhoto}
                        onChange={(e) => setMemPhoto(e.target.value)}
                        placeholder="URL Foto..."
                        className="flex-1 p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[10px] font-mono text-pastel-text"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Cerita Memo Manis</label>
                  <textarea
                    rows="3"
                    value={memStory}
                    onChange={(e) => setMemStory(e.target.value)}
                    placeholder="Tuliskan momen lucu atau kata manis dari kencan ini..."
                    className="w-full p-2.5 rounded-xl bg-white border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-pastel-lavender text-white font-headline font-bold text-xs shadow-squish hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Kenangan Ke Flip Book</span>
                </button>
              </form>

              {/* Existing Memories Manager List */}
              <div className="space-y-3 pt-2">
                <h3 className="font-headline font-bold text-sm text-pastel-text">
                  Daftar Kenangan Kencan Saat Ini ({memories?.length || 0})
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {memories && memories.map((m) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-pastel-canvas border border-pastel-pink/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={m.photo} alt={m.title} className="w-12 h-12 rounded-xl object-cover border border-amber-900/10" />
                        <div>
                          <h4 className="font-headline font-bold text-xs text-pastel-text">{m.title}</h4>
                          <p className="text-[10px] text-pastel-text/70">{m.date} • {m.location} ({m.category})</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMem(m.id)}
                        className="p-2 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: EDIT KARTU GOSOK */}
          {adminTab === 'vouchers' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 space-y-6">
              <div className="border-b border-dashed border-pastel-pink/30 pb-3">
                <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
                  <span>🎟️ Pengaturan Kartu Gosok Hadiah</span>
                </h2>
                <p className="text-xs text-pastel-text mt-0.5">Kelola status voucher gosok dan reset kartu.</p>
              </div>

              <div className="p-6 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-pastel-pink/20 text-pastel-pink-dark mx-auto flex items-center justify-center border border-pastel-pink/40 shadow-sticker">
                  <RefreshCw className="w-6 h-6 text-pastel-pink" />
                </div>
                <div>
                  <h3 className="font-headline font-extrabold text-base text-pastel-lavender-dark">
                    Reset Semua Status Kartu Gosok
                  </h3>
                  <p className="text-xs text-pastel-text max-w-md mx-auto mt-1">
                    Jika Bebe sudah menggosok semua kartu dan Lesmana ingin mereset kembali agar bisa digosok ulang, tekan tombol di bawah ini.
                  </p>
                </div>
                <button
                  onClick={handleResetVouchers}
                  className="px-6 py-3 rounded-2xl bg-pastel-pink text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-105 active:scale-95 transition-all btn-squish"
                >
                  Reset Semua Kupon Sekarang
                </button>
              </div>

              {/* Current Vouchers Preview */}
              <div className="space-y-3">
                <h3 className="font-headline font-bold text-sm text-pastel-text">Daftar Voucher Hadiah saat ini:</h3>
                <div className="space-y-2">
                  {vouchers && vouchers.map((v) => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-white border border-pastel-pink/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-headline font-bold text-pastel-lavender-dark block">{v.title}</span>
                        <span className="text-[10px] text-pastel-text/70">{v.description}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] ${v.claimed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {v.claimed ? 'Tergosok / Terklaim' : '🔒 Belum Tergosok'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PANEL 4: EDIT SURAT CINTA & AUDIO */}
          {adminTab === 'letter' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 space-y-6">
              <div className="border-b border-dashed border-pastel-pink/30 pb-3">
                <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
                  <span>💌 Edit Surat Cinta & Pesan Suara</span>
                </h2>
                <p className="text-xs text-pastel-text mt-0.5">Ubah isi teks surat cinta romantis dan URL audio rekaman voice note.</p>
              </div>

              <form onSubmit={handleSaveLetter} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Pengirim</label>
                    <input
                      type="text"
                      value={letterSender}
                      onChange={(e) => setLetterSender(e.target.value)}
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Penerima</label>
                    <input
                      type="text"
                      value={letterReceiver}
                      onChange={(e) => setLetterReceiver(e.target.value)}
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Judul Surat Cinta</label>
                  <input
                    type="text"
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-pastel-text mb-1">Teks Lengkap Isi Surat Cinta</label>
                  <textarea
                    rows="8"
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text leading-relaxed font-body"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-pastel-text mb-1">URL File MP3 Voice Note / Lagu</label>
                    <input
                      type="url"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://cdn.pixabay.com/..."
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pastel-text mb-1">Durasi Audio</label>
                    <input
                      type="text"
                      value={audioDuration}
                      onChange={(e) => setAudioDuration(e.target.value)}
                      placeholder="02:30"
                      className="w-full p-3 rounded-xl bg-pastel-canvas border border-pastel-pink/30 text-xs font-medium text-pastel-text font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-pastel-pink-dark text-white font-headline font-bold text-xs shadow-squish-pink hover:scale-[1.01] active:scale-95 transition-all btn-squish flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Surat & Audio</span>
                </button>
              </form>
            </div>
          )}

          {/* PANEL 5: EDIT KUIS TRIVIA */}
          {adminTab === 'quiz' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-scrapbook border-2 border-dashed border-pastel-lavender/40 space-y-6">
              <div className="border-b border-dashed border-pastel-pink/30 pb-3">
                <h2 className="font-headline font-extrabold text-xl text-pastel-lavender-dark flex items-center gap-2">
                  <span>💡 Preview Soal Kuis Trivia Cinta</span>
                </h2>
                <p className="text-xs text-pastel-text mt-0.5">Daftar soal-soal kuis trivia cinta saat ini.</p>
              </div>

              <div className="space-y-3">
                {quiz && quiz.map((q, i) => (
                  <div key={q.id || i} className="p-4 rounded-2xl bg-pastel-canvas border border-pastel-pink/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-headline font-bold text-pastel-lavender-dark">
                      <span>Soal {i + 1}: {q.question}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {q.options?.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border ${idx === q.answer ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-800' : 'bg-white border-gray-200 text-pastel-text'}`}
                        >
                          {opt} {idx === q.answer ? '✓ (Kunci)' : ''}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-pastel-text/70 italic pt-1">💡 {q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
