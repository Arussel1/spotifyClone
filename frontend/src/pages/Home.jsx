import { useState, useEffect } from 'react';
import { getSongs } from '../api';

function Home() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      setLoading(true);
      const data = await getSongs();
      setSongs(data);
    } catch (err) {
      console.error('Error loading songs:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase()) ||
    song.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-home">
      <div className="page-header">
        <h1>Your Library</h1>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your music...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-music"></i>
          <h2>No songs found</h2>
          <p>{search ? 'Try a different search term' : 'Add some tracks to get started'}</p>
        </div>
      ) : (
        <div className="song-grid">
          {filtered.map(song => (
            <div key={song._id} className="song-card">
              <div className="card-image">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/181818/1DB954?text=♪';
                  }}
                />
                <div className="play-btn">
                  <i className="fas fa-play"></i>
                </div>
              </div>
              <div className="card-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
