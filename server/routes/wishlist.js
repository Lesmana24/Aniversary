const express = require('express');
const router = express.Router();
const { db, firebaseInitialized, getLocalData, saveLocalData } = require('../config/firebaseAdmin');

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    if (firebaseInitialized) {
      const snapshot = await db.collection('wishlist').get();
      if (!snapshot.empty) {
        const wishlist = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, mode: 'firebase', data: wishlist });
      }
    }
    const local = getLocalData();
    res.json({ success: true, mode: 'local', data: local.wishlist || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist - Add new dream
router.post('/', async (req, res) => {
  try {
    const newWish = {
      id: 'wish-' + Date.now(),
      title: req.body.title || 'Impian Indah Baru',
      category: req.body.category || 'General',
      completed: false,
      priority: req.body.priority || 'Medium'
    };

    if (firebaseInitialized) {
      await db.collection('wishlist').doc(newWish.id).set(newWish);
    }
    const local = getLocalData();
    local.wishlist = [...(local.wishlist || []), newWish];
    saveLocalData(local);

    res.json({ success: true, data: newWish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/wishlist/:id/toggle - Toggle completed
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const local = getLocalData();
    let updatedItem = null;

    local.wishlist = (local.wishlist || []).map(w => {
      if (w.id === id) {
        updatedItem = { ...w, completed: !w.completed };
        return updatedItem;
      }
      return w;
    });
    saveLocalData(local);

    if (firebaseInitialized && updatedItem) {
      await db.collection('wishlist').doc(id).update({ completed: updatedItem.completed });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
