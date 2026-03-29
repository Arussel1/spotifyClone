const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Auth API Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should successfully register a user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'newuser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('newuser');

      const userInDb = await User.findOne({ username: 'newuser' });
      expect(userInDb).toBeTruthy();
    });

    it('should not register duplicate user', async () => {
      await User.create({ username: 'existing', password: 'password123' });
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'existing', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
       await request(app)
        .post('/api/auth/register')
        .send({ username: 'logintest', password: 'password123' });
    });

    it('should login valid user and return token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'logintest', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should fail on invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'logintest', password: 'wrongpassword' });

      expect(response.status).toBe(400);
    });
  });
});
