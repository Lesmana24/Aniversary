const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mounting
app.use('/api/auth', require('./routes/auth'));
app.use('/api/config', require('./routes/config'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/vouchers', require('./routes/vouchers'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/letter', require('./routes/letter'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Anniversary Scrapbook Backend API is running smoothly 💕',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✨ Server running on http://localhost:${PORT}`);
});
