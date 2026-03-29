const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
