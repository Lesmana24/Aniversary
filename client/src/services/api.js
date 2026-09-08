import { db, storage } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE = '/api';

// Initial default fallback seed data
const DEFAULT_DATA = {
  config: {
    title: "Lesmana & Nafla 2nd Anniversary",
    startDate: "2024-09-08T00:00:00.000Z",
    targetDate: "2026-09-08T00:00:00.000Z",
    partner1: "Lesmana",
    partner2: "Nafla (Bebe)",
    subtitle: "730 Hari Penuh Cinta, Tawa & Kenangan Indah",
    coverPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    bgmTitle: "Pesan Suara & Lagu Spesial Bebe 🎧"
  },
  wishlist: [
    { id: "wish-1", title: "Piknik Santai di Kebun Raya Bogor", category: "Outdoor", completed: true, priority: "High" },
    { id: "wish-2", title: "Pottery Class Studio Bikin Cangkir Berdua", category: "Creative", completed: false, priority: "High" },
    { id: "wish-3", title: "Nonton Live Concert Musik Impian", category: "Entertainment", completed: false, priority: "Medium" },
    { id: "wish-4", title: "Short Getaway Ke Pantai Sunset", category: "Trip", completed: false, priority: "High" }
  ],
  memories: [
    {
      id: "mem-1",
      title: "Ngopi & Obrolan Panjang di Nako Bogor",
      date: "2024-09-08",
      location: "Nako Bogor",
      category: "Cafe",
      photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      story: "Hari pertama kencan resmi kita! Berawal dari canggung sampai lupa waktu karena ketawa terus dengar cerita lucu Bebe.",
      rating: 5
    },
    {
      id: "mem-2",
      title: "Sore Hangat Piknik di Senayan Park GBK",
      date: "2024-11-14",
      location: "GBK Jakarta",
      category: "Outdoor",
      photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      story: "Gelar tikar sambil milih matcha gelato kesukaan Bebe. Angin sorenya sejuk banget, sama sejuknya kayak senyum Bebe.",
      rating: 5
    },
    {
      id: "mem-3",
      title: "Gelato Walk & Berburu Vinyl di Blok M",
      date: "2025-02-14",
      location: "Blok M Jakarta",
      category: "Cafe",
      photo: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
      story: "Jalan-jalan santai pegangan tangan pas Valentine. Foto polaroid kita di dekat kedai kopi tua jadi kenangan paling manis.",
      rating: 5
    }
  ],
  vouchers: [
    { id: "vouch-1", title: "Tiket Kencan Bebas Impian 🎟️", description: "Bebas pilih tempat dinner + nonton film bioskop pilihan Bebe tanpa perdebatan!", code: "BEBE-ROMANTIC-DATE-2026", expiry: "Berlaku Selamanya", claimed: false, badge: "Special Gift" },
    { id: "vouch-2", title: "Kupon Relaksasi & Head Massage 💆‍♀️", description: "Gratis pijat bahu + kepala 30 menit dari Lesmana lengkap dengan aroma terapi kesukaan.", code: "LESMANA-MASSAGE-PAMPER", expiry: "Berlaku 100x Penggunaan", claimed: false, badge: "Pamper Season" },
    { id: "vouch-3", title: "Voucher Hadiah Misteri 2 Tahun 🎁", description: "Pesan Rahasia: 'Aku sayang Bebe selamanya. Makasih udah jadi rumah paling nyaman 2 tahun ini.'", code: "FOREVER-LESMANA-BEBE", expiry: "Janji Suci", claimed: false, badge: "Secret Gift" }
  ],
  quiz: [
    { id: "q-1", question: "Kapan tanggal resmi kita jadian?", options: ["8 September 2024", "10 Oktober 2024", "14 Februari 2024", "8 Agustus 2024"], answer: 0, explanation: "Pintar! Tanggal 8 September 2024 adalah awal mula perjalanan indah kita!" },
    { id: "q-2", question: "Di mana tempat kencan resmi pertama Lesmana & Bebe?", options: ["Nako Bogor", "Blok M", "Monas", "Bioskop XXI"], answer: 0, explanation: "Tepat sekali! Ngopi santai di Nako Bogor sambil obrolan pertama kita." },
    { id: "q-3", question: "Varian gelato kesukaan Bebe pas kita jalan-jalan di Blok M?", options: ["Matcha & Pistachio", "Chocolate Deluxe", "Vanilla Bean", "Strawberry Sorbet"], answer: 0, explanation: "Yup! Matcha & Pistachio selalu jadi pilihan utama favorit Bebe!" },
    { id: "q-4", question: "Siapa yang paling sering panggil sebutan manis 'Bebe'?", options: ["Lesmana dong!", "Semua orang", "Teman kampus", "Kucing tetangga"], answer: 0, explanation: "Tentu saja Lesmana! Panggilan khusus paling penuh kasih sayang." },
    { id: "q-5", question: "Berapa lama Lesmana bakal sayang sama Bebe?", options: ["Selamanya sampai tua ∞", "730 hari aja", "Sampai besok", "100 tahun"], answer: 0, explanation: "Pastinya SELAMANYA sampai tua nanti ❤️!" }
  ],
  letter: {
    sender: "Lesmana",
    receiver: "Nafla (Bebe) Sayang",
    title: "Surat Cinta 730 Hari Bersama",
    date: "8 September 2026",
    content: "Halo Bebe sayang,\n\nTidak terasa sudah 730 hari (2 tahun penuh) kita berjalan berdampingan. Dari awal pertemuan yang penuh rasa canggung, obrolan manis sampai larut malam, gelak tawa di sela-sela kesibukan, sampai saat-saat kita saling menguatkan saat lelah.\n\nSetiap momen bersama Bebe selalu terasa istimewa. Terima kasih sudah menjadi sosok yang begitu sabar, manis, penuh perhatian, dan selalu membawa kehangatan di hari-hari Lesmana.\n\nSemoga di tahun ke-3 dan tahun-tahun berikutnya, kita bisa terus merajut impian bersama, menjelajahi tempat-tempat baru, dan saling mencintai dengan lebih dewasa dan bahagia.\n\nSelamat Anniversary ke-2 ya, Bebe sayang! I love you so much ❤️",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    audioDuration: "02:30"
  }
};

// Helper: Try Express REST API, fallback to Firestore directly
async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) return data;
    }
  } catch (e) {
    // API server not present or 404 (e.g. Netlify static hosting)
  }
  return null;
}

// Client-side image compressor (converts large photos to optimized ~50-100KB Data URLs)
const compressImage = (file, maxWidth = 800, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// 1. Upload Image Helper (Fast Instant Compressed Image Uploader)
export const uploadImage = async (file) => {
  if (!file) return null;

  try {
    // Compress image to optimized 800px JPEG (~50-80KB) for instant upload & zero CORS errors
    const compressedDataUrl = await compressImage(file, 800, 0.75);
    return compressedDataUrl;
  } catch (e) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
};

// 2. Admin Auth
export const loginAdmin = async (credentials) => {
  const apiRes = await safeFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (apiRes) return apiRes;

  // Direct client auth validation for Netlify
  const { username, password } = credentials || {};
  if (username?.toLowerCase() === 'lesmana' && password === 'bebesayang2026') {
    return {
      success: true,
      token: 'secret-lesmana-admin-token-2026',
      user: { username: 'lesmana', role: 'ADMIN' }
    };
  }
  return { success: false, message: 'Username atau Password salah!' };
};

// 3. Config
export const fetchConfig = async () => {
  const apiRes = await safeFetch(`${API_BASE}/config`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'settings', 'anniversary');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { success: true, mode: 'firebase-client', data: snap.data() };
      } else {
        await setDoc(docRef, DEFAULT_DATA.config);
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.config };
      }
    } catch (e) {
      console.warn("Firestore fetchConfig error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.config };
};

export const updateConfig = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'settings', 'anniversary');
      await setDoc(docRef, data, { merge: true });
      const snap = await getDoc(docRef);
      return { success: true, data: snap.data() };
    } catch (e) {
      console.warn("Firestore updateConfig error:", e);
    }
  }
  return { success: true, data };
};

// Helper to track if database has already been initialized (prevents auto-reseeding deleted items)
async function checkOrSetInitialized() {
  if (!db) return true;
  try {
    const initRef = doc(db, 'settings', 'init');
    const initSnap = await getDoc(initRef);
    if (initSnap.exists()) {
      return true; // Already initialized
    }

    const anniversaryRef = doc(db, 'settings', 'anniversary');
    const anniversarySnap = await getDoc(anniversaryRef);
    if (anniversarySnap.exists()) {
      await setDoc(initRef, { initialized: true, createdAt: new Date().toISOString() });
      return true; // Already established DB
    }

    await setDoc(initRef, { initialized: true, createdAt: new Date().toISOString() });
    return false; // First time init
  } catch (e) {
    console.warn("Firestore checkInitialized error:", e);
    return true; // Default to true on error so we don't accidentally overwrite user deletions
  }
}

// 4. Wishlist
export const fetchWishlist = async () => {
  const apiRes = await safeFetch(`${API_BASE}/wishlist`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const colRef = collection(db, 'wishlist');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, mode: 'firebase-client', data: items };
      } else {
        const isInit = await checkOrSetInitialized();
        if (isInit) {
          return { success: true, mode: 'firebase-client', data: [] };
        }
        for (const item of DEFAULT_DATA.wishlist) {
          await setDoc(doc(db, 'wishlist', item.id), item);
        }
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.wishlist };
      }
    } catch (e) {
      console.warn("Firestore fetchWishlist error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.wishlist };
};

export const addWish = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  const newWish = {
    id: 'wish-' + Date.now(),
    title: data.title || 'Impian Baru',
    category: data.category || 'Outdoor',
    completed: false,
    priority: data.priority || 'High'
  };

  if (db) {
    try {
      await setDoc(doc(db, 'wishlist', newWish.id), newWish);
    } catch (e) {
      console.warn("Firestore addWish error:", e);
    }
  }
  return { success: true, data: newWish };
};

export const toggleWish = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/wishlist/${id}/toggle`, {
    method: 'PATCH'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'wishlist', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const current = snap.data();
        const updated = !current.completed;
        await updateDoc(docRef, { completed: updated });
        return { success: true, data: { ...current, id, completed: updated } };
      }
    } catch (e) {
      console.warn("Firestore toggleWish error:", e);
    }
  }
  return { success: true };
};

export const deleteWish = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/wishlist/${id}`, {
    method: 'DELETE'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      await deleteDoc(doc(db, 'wishlist', id));
    } catch (e) {
      console.warn("Firestore deleteWish error:", e);
    }
  }
  return { success: true };
};

// 5. Memories
export const fetchMemories = async () => {
  const apiRes = await safeFetch(`${API_BASE}/memories`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const colRef = collection(db, 'memories');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, mode: 'firebase-client', data: items };
      } else {
        const isInit = await checkOrSetInitialized();
        if (isInit) {
          return { success: true, mode: 'firebase-client', data: [] };
        }
        for (const m of DEFAULT_DATA.memories) {
          await setDoc(doc(db, 'memories', m.id), m);
        }
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.memories };
      }
    } catch (e) {
      console.warn("Firestore fetchMemories error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.memories };
};

export const addMemory = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  const newMem = {
    id: 'mem-' + Date.now(),
    title: data.title || 'Momen Baru',
    date: data.date || new Date().toISOString().split('T')[0],
    location: data.location || 'Tempat Indah',
    category: data.category || 'Cafe',
    photo: data.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    story: data.story || '',
    rating: data.rating || 5
  };

  if (db) {
    try {
      await setDoc(doc(db, 'memories', newMem.id), newMem);
    } catch (e) {
      console.warn("Firestore addMemory error:", e);
    }
  }
  return { success: true, data: newMem };
};

export const deleteMemory = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/memories/${id}`, {
    method: 'DELETE'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (e) {
      console.warn("Firestore deleteMemory error:", e);
    }
  }
  return { success: true };
};

// 6. Vouchers
export const fetchVouchers = async () => {
  const apiRes = await safeFetch(`${API_BASE}/vouchers`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const colRef = collection(db, 'vouchers');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, mode: 'firebase-client', data: items };
      } else {
        const isInit = await checkOrSetInitialized();
        if (isInit) {
          return { success: true, mode: 'firebase-client', data: [] };
        }
        for (const v of DEFAULT_DATA.vouchers) {
          await setDoc(doc(db, 'vouchers', v.id), v);
        }
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.vouchers };
      }
    } catch (e) {
      console.warn("Firestore fetchVouchers error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.vouchers };
};

export const addVoucher = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/vouchers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  const newVoucher = {
    id: 'vouch-' + Date.now(),
    title: data.title || 'Voucher Hadiah',
    description: data.description || '',
    code: data.code || 'HADIAH-BEBE-' + Date.now(),
    expiry: data.expiry || 'Berlaku Selamanya',
    claimed: false,
    badge: data.badge || 'Special Gift'
  };

  if (db) {
    try {
      await setDoc(doc(db, 'vouchers', newVoucher.id), newVoucher);
    } catch (e) {
      console.warn("Firestore addVoucher error:", e);
    }
  }
  return { success: true, data: newVoucher };
};

export const deleteVoucher = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/vouchers/${id}`, {
    method: 'DELETE'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      await deleteDoc(doc(db, 'vouchers', id));
    } catch (e) {
      console.warn("Firestore deleteVoucher error:", e);
    }
  }
  return { success: true };
};

export const claimVoucher = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/vouchers/${id}/claim`, {
    method: 'POST'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'vouchers', id);
      await updateDoc(docRef, { claimed: true, claimedAt: new Date().toISOString() });
    } catch (e) {
      console.warn("Firestore claimVoucher error:", e);
    }
  }
  return { success: true };
};

export const resetVouchers = async () => {
  const apiRes = await safeFetch(`${API_BASE}/vouchers/reset`, {
    method: 'POST'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      for (const v of DEFAULT_DATA.vouchers) {
        await setDoc(doc(db, 'vouchers', v.id), { ...v, claimed: false, claimedAt: null });
      }
    } catch (e) {
      console.warn("Firestore resetVouchers error:", e);
    }
  }
  return { success: true };
};

// 7. Quiz
export const fetchQuiz = async () => {
  const apiRes = await safeFetch(`${API_BASE}/quiz`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const colRef = collection(db, 'quiz');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, mode: 'firebase-client', data: items };
      } else {
        const isInit = await checkOrSetInitialized();
        if (isInit) {
          return { success: true, mode: 'firebase-client', data: [] };
        }
        for (const q of DEFAULT_DATA.quiz) {
          await setDoc(doc(db, 'quiz', q.id), q);
        }
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.quiz };
      }
    } catch (e) {
      console.warn("Firestore fetchQuiz error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.quiz };
};

export const addQuiz = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  const newQuiz = {
    id: 'q-' + Date.now(),
    question: data.question || '',
    options: data.options || ['', '', '', ''],
    answer: data.answer ?? 0,
    explanation: data.explanation || ''
  };

  if (db) {
    try {
      await setDoc(doc(db, 'quiz', newQuiz.id), newQuiz);
    } catch (e) {
      console.warn("Firestore addQuiz error:", e);
    }
  }
  return { success: true, data: newQuiz };
};

export const deleteQuiz = async (id) => {
  const apiRes = await safeFetch(`${API_BASE}/quiz/${id}`, {
    method: 'DELETE'
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      await deleteDoc(doc(db, 'quiz', id));
    } catch (e) {
      console.warn("Firestore deleteQuiz error:", e);
    }
  }
  return { success: true };
};

// 8. Letter
export const fetchLetter = async () => {
  const apiRes = await safeFetch(`${API_BASE}/letter`);
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'settings', 'letter');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { success: true, mode: 'firebase-client', data: snap.data() };
      } else {
        await setDoc(docRef, DEFAULT_DATA.letter);
        return { success: true, mode: 'firebase-client', data: DEFAULT_DATA.letter };
      }
    } catch (e) {
      console.warn("Firestore fetchLetter error:", e);
    }
  }
  return { success: true, mode: 'local', data: DEFAULT_DATA.letter };
};

export const updateLetter = async (data) => {
  const apiRes = await safeFetch(`${API_BASE}/letter`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (apiRes) return apiRes;

  if (db) {
    try {
      const docRef = doc(db, 'settings', 'letter');
      await setDoc(docRef, data, { merge: true });
      const snap = await getDoc(docRef);
      return { success: true, data: snap.data() };
    } catch (e) {
      console.warn("Firestore updateLetter error:", e);
    }
  }
  return { success: true, data };
};
