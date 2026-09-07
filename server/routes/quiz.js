const express = require('express');
const router = express.Router();
const { db, firebaseInitialized, getLocalData, saveLocalData } = require('../config/firebaseAdmin');

// GET /api/quiz
router.get('/', async (req, res) => {
  try {
    if (firebaseInitialized) {
      const snapshot = await db.collection('quiz').get();
      if (!snapshot.empty) {
        const quiz = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, mode: 'firebase', data: quiz });
      }
    }
    const local = getLocalData();
    res.json({ success: true, mode: 'local', data: local.quiz || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
