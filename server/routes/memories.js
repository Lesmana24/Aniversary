const express = require('express');
const router = express.Router();
const { db, firebaseInitialized, getLocalData, saveLocalData } = require('../config/firebaseAdmin');

// GET /api/memories
router.get('/', async (req, res) => {
  try {
    if (firebaseInitialized) {
      const snapshot = await db.collection('memories').orderBy('date', 'desc').get();
      if (!snapshot.empty) {
        const memories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, mode: 'firebase', data: memories });
      }
    }
    const local = getLocalData();
    res.json({ success: true, mode: 'local', data: local.memories || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/memories - Add new date memory
router.post('/', async (req, res) => {
  try {
    const newMemory = {
      id: 'mem-' + Date.now(),
      title: req.body.title || 'Momen Spesial Baru',
      date: req.body.date || new Date().toISOString().split('T')[0],
      location: req.body.location || 'Tempat Indah',
      category: req.body.category || 'Cafe',
      photo: req.body.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      story: req.body.story || '',
      rating: parseInt(req.body.rating) || 5
    };

    if (firebaseInitialized) {
      await db.collection('memories').doc(newMemory.id).set(newMemory);
    }
    
    const local = getLocalData();
    local.memories = [newMemory, ...(local.memories || [])];
    saveLocalData(local);

    res.json({ success: true, data: newMemory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/memories/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (firebaseInitialized) {
      await db.collection('memories').doc(id).delete();
    }
    const local = getLocalData();
    local.memories = (local.memories || []).filter(m => m.id !== id);
    saveLocalData(local);

    res.json({ success: true, message: 'Memory deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
