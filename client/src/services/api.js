import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE = '/api';

// Helper function to upload an image from device directly to Firebase Storage (with base64 fallback)
export const uploadImage = async (file) => {
  if (!file) return null;

  try {
    if (storage) {
      const fileName = `scrapbook_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `memories/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (err) {
    console.warn("Firebase storage upload error, falling back to local FileReader:", err);
  }

  // Fallback: Read file as Data URL (base64)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const loginAdmin = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return res.json();
};

export const fetchConfig = async () => {
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
};

export const updateConfig = async (data) => {
  const res = await fetch(`${API_BASE}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const fetchMemories = async () => {
  const res = await fetch(`${API_BASE}/memories`);
  return res.json();
};

export const addMemory = async (data) => {
  const res = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteMemory = async (id) => {
  const res = await fetch(`${API_BASE}/memories/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchVouchers = async () => {
  const res = await fetch(`${API_BASE}/vouchers`);
  return res.json();
};

export const claimVoucher = async (id) => {
  const res = await fetch(`${API_BASE}/vouchers/${id}/claim`, {
    method: 'POST'
  });
  return res.json();
};

export const resetVouchers = async () => {
  const res = await fetch(`${API_BASE}/vouchers/reset`, {
    method: 'POST'
  });
  return res.json();
};

export const fetchWishlist = async () => {
  const res = await fetch(`${API_BASE}/wishlist`);
  return res.json();
};

export const addWish = async (data) => {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const toggleWish = async (id) => {
  const res = await fetch(`${API_BASE}/wishlist/${id}/toggle`, {
    method: 'PATCH'
  });
  return res.json();
};

export const fetchQuiz = async () => {
  const res = await fetch(`${API_BASE}/quiz`);
  return res.json();
};

export const fetchLetter = async () => {
  const res = await fetch(`${API_BASE}/letter`);
  return res.json();
};

export const updateLetter = async (data) => {
  const res = await fetch(`${API_BASE}/letter`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};
