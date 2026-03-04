const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// CREATE — POST /api/songs
router.post('/', async (req, res) => {
  try {
    const { title, artist, album, duration, coverUrl } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and Artist are required.' });
    }

    const song = new Song({ title, artist, album, duration, coverUrl });
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating song.' });
  }
});

// READ ALL — GET /api/songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching songs.' });
  }
});

// READ ONE — GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found.' });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching song.' });
  }
});

// UPDATE — PUT /api/songs/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, artist, album, duration, coverUrl } = req.body;
    const song = await Song.findByIdAndUpdate(
      req.params.id,
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
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({ error: 'Song not found.' });
    }

    res.status(200).json({ message: 'Song deleted successfully.', song });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting song.' });
  }
});

module.exports = router;
