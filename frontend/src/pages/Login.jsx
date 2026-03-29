import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <i className="fab fa-spotify" style={{ fontSize: '48px', color: 'var(--green-primary)', marginBottom: '16px' }}></i>
          <h2>Welcome Back</h2>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Log in to your Spotify clone account</p>
        </div>
        
        {error && <div className="form-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Log In'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
