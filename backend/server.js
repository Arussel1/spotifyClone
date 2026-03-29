const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const seedDatabase = require('./seed');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
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

      server.listen(PORT, () => {
        console.log(`Backend server running at http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
