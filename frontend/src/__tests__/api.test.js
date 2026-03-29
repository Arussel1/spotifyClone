import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSongs, getSong, createSong, updateSong, deleteSong, loginApi, registerApi, AUTH_BASE } from '../api';

const mockSongs = [
  { _id: '1', title: 'Song 1', artist: 'Artist 1' },
  { _id: '2', title: 'Song 2', artist: 'Artist 2' }
];

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  describe('Auth API', () => {
    it('should successfully login and return data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'mock-token', user: { username: 'test' } })
      });

      const res = await loginApi({ username: 'test', password: '123' });
      expect(fetch).toHaveBeenCalledWith(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: '123' })
      });
      expect(res.token).toBe('mock-token');
    });

    it('should successfully register and return data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'mock-token', user: { username: 'test' } })
      });

      const res = await registerApi({ username: 'test', password: '123' });
      expect(fetch).toHaveBeenCalledWith(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: '123' })
      });
      expect(res.token).toBe('mock-token');
    });
  });

  describe('Song requests with Auth Headers', () => {
    it('should fetch and return all songs with Auth headers if token exists', async () => {
      localStorage.setItem('token', 'fake-token');
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSongs
      });

      const songs = await getSongs();
      expect(fetch).toHaveBeenCalledWith('/api/songs', expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }
      }));
      expect(songs).toEqual(mockSongs);
    });

    it('should throw an error on failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false });
      await expect(getSongs()).rejects.toThrow('Failed to fetch songs');
    });
  });

  describe('createSong', () => {
    it('should send a POST request with Auth header', async () => {
      localStorage.setItem('token', 'fake-token');
      const newSong = { title: 'New', artist: 'New Artist' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...newSong, _id: '3' })
      });

      const result = await createSong(newSong);
      
      expect(fetch).toHaveBeenCalledWith('/api/songs', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        },
        body: JSON.stringify(newSong)
      }));
      expect(result.title).toBe('New');
    });
  });

  describe('deleteSong', () => {
    it('should send a DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Deleted' })
      });

      const result = await deleteSong('1');
      expect(fetch).toHaveBeenCalledWith('/api/songs/1', expect.objectContaining({
        method: 'DELETE'
      }));
      expect(result.message).toBe('Deleted');
    });
  });
});
