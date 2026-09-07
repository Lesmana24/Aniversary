const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'lesmana';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bebesayang2026';
const ADMIN_TOKEN = 'secret-lesmana-admin-token-2026';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username &&
    password &&
    username.toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      message: 'Login Admin Berhasil! Selamat Datang Lesmana 💕',
      token: ADMIN_TOKEN,
      user: { username: ADMIN_USERNAME, role: 'ADMIN' }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau Password salah! Hanya Lesmana yang memiliki akses.'
  });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.includes(ADMIN_TOKEN)) {
    return res.json({ success: true, authenticated: true });
  }
  return res.status(401).json({ success: false, authenticated: false });
});

module.exports = router;
