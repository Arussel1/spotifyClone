import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSongs, getSong, createSong, updateSong, deleteSong } from '../api';

const mockSongs = [
  { _id: '1', title: 'Song 1', artist: 'Artist 1' },
  { _id: '2', title: 'Song 2', artist: 'Artist 2' }
];

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getSongs', () => {
    it('should fetch and return all songs', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSongs
      });

      const songs = await getSongs();
      expect(fetch).toHaveBeenCalledWith('/api/songs');
      expect(songs).toEqual(mockSongs);
    });

    it('should throw an error on failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false });
      await expect(getSongs()).rejects.toThrow('Failed to fetch songs');
    });
  });

  describe('createSong', () => {
    it('should send a POST request and return the new song', async () => {
      const newSong = { title: 'New', artist: 'New Artist' };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...newSong, _id: '3' })
      });

      const result = await createSong(newSong);
      
      expect(fetch).toHaveBeenCalledWith('/api/songs', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSong)
      }));
      expect(result.title).toBe('New');
      expect(result._id).toBe('3');
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
