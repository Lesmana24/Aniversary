const express = require('express');
const router = express.Router();
const { db, firebaseInitialized, getLocalData, saveLocalData } = require('../config/firebaseAdmin');

// GET /api/config - Get anniversary settings & stats
router.get('/', async (req, res) => {
  try {
    if (firebaseInitialized) {
      const doc = await db.collection('settings').doc('anniversary').get();
      if (doc.exists) {
        return res.json({ success: true, mode: 'firebase', data: doc.data() });
      }
    }
    const local = getLocalData();
    res.json({ success: true, mode: 'local', data: local.config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/config - Update anniversary settings
router.put('/', async (req, res) => {
  try {
    const updateData = req.body;
    if (firebaseInitialized) {
      await db.collection('settings').doc('anniversary').set(updateData, { merge: true });
    }
    const local = getLocalData();
    local.config = { ...local.config, ...updateData };
    saveLocalData(local);
    
    res.json({ success: true, data: local.config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
