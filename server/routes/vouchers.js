const express = require('express');
const router = express.Router();
const { db, firebaseInitialized, getLocalData, saveLocalData } = require('../config/firebaseAdmin');

// GET /api/vouchers
router.get('/', async (req, res) => {
  try {
    if (firebaseInitialized) {
      const snapshot = await db.collection('vouchers').get();
      if (!snapshot.empty) {
        const vouchers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, mode: 'firebase', data: vouchers });
      }
    }
    const local = getLocalData();
    res.json({ success: true, mode: 'local', data: local.vouchers || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/vouchers/:id/claim - Claim a voucher
router.post('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    if (firebaseInitialized) {
      await db.collection('vouchers').doc(id).update({
        claimed: true,
        claimedAt: now
      });
    }

    const local = getLocalData();
    local.vouchers = (local.vouchers || []).map(v => {
      if (v.id === id) {
        return { ...v, claimed: true, claimedAt: now };
      }
      return v;
    });
    saveLocalData(local);

    const updated = local.vouchers.find(v => v.id === id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/vouchers/reset - Reset all voucher claims
router.post('/reset', async (req, res) => {
  try {
    const local = getLocalData();
    local.vouchers = (local.vouchers || []).map(v => ({
      ...v,
      claimed: false,
      claimedAt: null
    }));
    saveLocalData(local);

    if (firebaseInitialized) {
      const batch = db.batch();
      local.vouchers.forEach(v => {
        const ref = db.collection('vouchers').doc(v.id);
        batch.set(ref, v);
      });
      await batch.commit();
    }

    res.json({ success: true, data: local.vouchers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
