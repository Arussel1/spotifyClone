import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSong } from '../api';

function AddTrack() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    coverUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.artist.trim()) {
      setError('Title and Artist are required.');
      return;
    }

    try {
      setSubmitting(true);
      await createSong(form);
      navigate('/');
    } catch (err) {
      setError('Failed to add song. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-add">
      <div className="page-header">
        <h1>Add New Track</h1>
        <p className="subtitle">Add a new song to your library</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Song Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Blinding Lights"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="artist">Artist *</label>
            <input
              type="text"
              id="artist"
              name="artist"
              placeholder="e.g. The Weeknd"
              value={form.artist}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                placeholder="e.g. After Hours"
                value={form.album}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration</label>
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="e.g. 3:20"
                value={form.duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverUrl">Cover Image URL</label>
            <input
              type="url"
              id="coverUrl"
              name="coverUrl"
              placeholder="https://example.com/cover.jpg"
              value={form.coverUrl}
              onChange={handleChange}
            />
          </div>

          {form.coverUrl && (
            <div className="cover-preview">
              <img
                src={form.coverUrl}
                alt="Cover preview"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <span className="btn-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Add to Library
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTrack;
