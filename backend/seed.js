const Song = require('./models/Song');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const testSongs = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png'
  },
  {
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: '3:50',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png'
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: '3:23',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c6/Dua_Lipa_Levitating_Solo_Single_Cover.jpeg'
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: '3:53',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png'
  },
  {
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep, Where Do We Go?',
    duration: '3:14',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/33/Billie_Eilish_-_Bad_Guy.png'
  }
];

/**
 * Seeds the database with test song data if the collection is empty.
 */
async function seedDatabase() {
  try {
    let user = await User.findOne({ username: 'testuser' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = new User({ username: 'testuser', password: hashedPassword });
      await user.save();
      console.log('Created default user: testuser');
    }

    const count = await Song.countDocuments();

    if (count === 0) {
      const songsWithUser = testSongs.map(song => ({ ...song, userId: user._id }));
      await Song.insertMany(songsWithUser);
      console.log(`Database seeded with ${testSongs.length} test songs.`);
    } else {
      console.log(`Database already has ${count} song(s). Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

module.exports = seedDatabase;
