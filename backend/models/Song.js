const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    default: 'Unknown Album',
    trim: true
  },
  duration: {
    type: String,
    default: '0:00'
  },
  coverUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Song', songSchema);
