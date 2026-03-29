const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// CREATE — POST /api/songs
router.post('/', auth, async (req, res) => {
  try {
    const { title, artist, album, duration, coverUrl } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and Artist are required.' });
    }

    const song = new Song({ title, artist, album, duration, coverUrl, userId: req.user.id });
    const savedSong = await song.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('new_activity', { message: `Someone just added "${savedSong.title}" by ${savedSong.artist}!` });
    }

    res.status(201).json(savedSong);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating song.' });
  }
});

// READ ALL — GET /api/songs
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching songs.' });
  }
});

// READ ONE — GET /api/songs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, userId: req.user.id });

    if (!song) {
      return res.status(404).json({ error: 'Song not found.' });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching song.' });
  }
});

// UPDATE — PUT /api/songs/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, artist, album, duration, coverUrl } = req.body;
    const song = await Song.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, artist, album, duration, coverUrl },
      { new: true, runValidators: true }
    );

    if (!song) {
      return res.status(404).json({ error: 'Song not found.' });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating song.' });
  }
});

// DELETE — DELETE /api/songs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const song = await Song.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!song) {
      return res.status(404).json({ error: 'Song not found.' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('new_activity', { message: `Someone just deleted the track "${song.title}".` });
    }

    res.status(200).json({ message: 'Song deleted successfully.', song });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting song.' });
  }
});

module.exports = router;
