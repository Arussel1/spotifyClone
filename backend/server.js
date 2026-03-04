const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const songRoutes = require('./routes/songRoutes');
const seedDatabase = require('./seed');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use('/api/songs', songRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifyClone';
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB');

      await seedDatabase();

      app.listen(PORT, () => {
        console.log(`Backend server running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
