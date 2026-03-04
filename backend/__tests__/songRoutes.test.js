const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Song = require('../models/Song');

let mongoServer;

// Setup 
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clear DB
afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Clean up 
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Song API Routes', () => {

  const sampleSong = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: '3:30',
    coverUrl: 'http://test.com/cover.jpg'
  };

  describe('POST /api/songs', () => {
    it('should create a new song with valid data', async () => {
      const response = await request(app)
        .post('/api/songs')
        .send(sampleSong);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(sampleSong.title);
      expect(response.body.artist).toBe(sampleSong.artist);
      expect(response.body._id).toBeDefined();

      const songInDb = await Song.findById(response.body._id);
      expect(songInDb).toBeTruthy();
      expect(songInDb.title).toBe(sampleSong.title);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/songs')
        .send({ artist: 'Test Artist' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if artist is missing', async () => {
      const response = await request(app)
        .post('/api/songs')
        .send({ title: 'Test Title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/songs', () => {
    it('should return an empty array when no songs exist', async () => {
      const response = await request(app).get('/api/songs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all songs sorted by newest first', async () => {
      // Create two songs
      await Song.create(sampleSong);
      await Song.create({ title: 'Song 2', artist: 'Artist 2' });

      const response = await request(app).get('/api/songs');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Song 2'); // Since it's sorted by createdAt -1 and was added last
      expect(response.body[1].title).toBe(sampleSong.title);
    });
  });

  describe('GET /api/songs/:id', () => {
    it('should return 404 for a non-existent song ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/songs/${fakeId}`);
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Song not found.');
    });

    it('should return 500 for an invalid ID format', async () => {
      const response = await request(app).get('/api/songs/123');
      expect(response.status).toBe(500); 
    });

    it('should return the correct song by ID', async () => {
      const song = await Song.create(sampleSong);
      const response = await request(app).get(`/api/songs/${song._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(song.title);
      expect(response.body._id.toString()).toBe(song._id.toString());
    });
  });

  describe('PUT /api/songs/:id', () => {
    it('should update an existing song with valid data', async () => {
      const song = await Song.create(sampleSong);
      
      const response = await request(app)
        .put(`/api/songs/${song._id}`)
        .send({ title: 'Updated Title' });
        
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.artist).toBe(sampleSong.artist); // Unchanged field should remain

      const songInDb = await Song.findById(song._id);
      expect(songInDb.title).toBe('Updated Title');
    });

    it('should return 404 if updating non-existent song', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/songs/${fakeId}`)
        .send({ title: 'Updated Title' });
        
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/songs/:id', () => {
    it('should delete an existing song', async () => {
      const song = await Song.create(sampleSong);
      
      const response = await request(app).delete(`/api/songs/${song._id}`);
      expect(response.status).toBe(200);
      
      const songInDb = await Song.findById(song._id);
      expect(songInDb).toBeNull();
    });

    it('should return 404 if deleting non-existent song', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/songs/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });

});
