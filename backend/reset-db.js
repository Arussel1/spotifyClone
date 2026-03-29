const mongoose = require('mongoose');
const Song = require('./models/Song');
const User = require('./models/User');
const seedDatabase = require('./seed');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spotifyClone';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB...');
    
    console.log('Deleting all songs to clean the database...');
    await Song.deleteMany({});
    console.log('Deleting all users...');
    await User.deleteMany({});
    console.log('Database cleaned.');

    console.log('Triggering the seed script...');
    await seedDatabase();

    console.log('Reset complete!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error during database reset:', err.message);
    process.exit(1);
  });
