import { useState, useEffect } from 'react';
import { getSongs, updateSong, deleteSong } from '../api';

function ManageLibrary() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      setLoading(true);
      const data = await getSongs();
      setSongs(data);
    } catch (err) {
      showMessage('Error loading songs.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text, type = 'success') {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }

  function startEdit(song) {
    setEditId(song._id);
    setEditForm({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration || '',
      coverUrl: song.coverUrl || ''
    });
  }

  function cancelEdit() {
    setEditId(null);
    setEditForm({});
  }

  async function saveEdit(id) {
    try {
      await updateSong(id, editForm);
      setEditId(null);
      setEditForm({});
      await loadSongs();
      showMessage('Song updated successfully!');
    } catch (err) {
      showMessage('Failed to update song.', 'error');
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await deleteSong(id);
      await loadSongs();
      showMessage('Song deleted.');
    } catch (err) {
      showMessage('Failed to delete song.', 'error');
    }
  }

  return (
    <div className="page-manage">
      <div className="page-header">
        <h1>Manage Library</h1>
        <p className="subtitle">{songs.length} song{songs.length !== 1 ? 's' : ''} in your library</p>
      </div>

      {message.text && (
        <div className={`toast toast-${message.type}`}>
          <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-database"></i>
          <h2>Library is empty</h2>
          <p>Add some tracks to get started</p>
        </div>
      ) : (
        <div className="manage-table-wrapper">
          <table className="manage-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song._id} className={editId === song._id ? 'editing' : ''}>
                  <td className="row-num">{index + 1}</td>

                  {editId === song._id ? (
                    <>
                      <td>
                        <input
                          className="edit-input"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="edit-input"
                          value={editForm.artist}
                          onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="edit-input"
                          value={editForm.album}
                          onChange={(e) => setEditForm({ ...editForm, album: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="edit-input"
                          value={editForm.duration}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                        />
                      </td>
                      <td className="actions-cell">
                        <button className="btn-icon btn-save" onClick={() => saveEdit(song._id)} title="Save">
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="btn-icon btn-cancel" onClick={cancelEdit} title="Cancel">
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="col-title">
                        <div className="title-cell">
                          <img
                            src={song.coverUrl}
                            alt=""
                            className="mini-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40x40/181818/1DB954?text=♪';
                            }}
                          />
                          {song.title}
                        </div>
                      </td>
                      <td>{song.artist}</td>
                      <td className="col-album">{song.album}</td>
                      <td className="col-duration">{song.duration}</td>
                      <td className="actions-cell">
                        <button className="btn-icon btn-edit" onClick={() => startEdit(song)} title="Edit">
                          <i className="fas fa-pen"></i>
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(song._id, song.title)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageLibrary;
