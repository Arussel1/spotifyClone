import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setError(null);
    setLoading(true);
    try {
      await register({ username, password });
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
          <h2>Create Account</h2>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Sign up to start saving your own tracks</p>
        </div>
        
        {error && <div className="form-error"><i className="fas fa-exclamation-circle"></i>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Choose a username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password"
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password"
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
