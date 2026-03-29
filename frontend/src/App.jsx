import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import AddTrack from './pages/AddTrack.jsx';
import ManageLibrary from './pages/ManageLibrary.jsx';
import './App.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      <NavLink to="/" className="logo">
        <i className="fab fa-spotify"></i>
        <span>Spotify</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        {user && (
          <>
            <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fas fa-plus-circle"></i>
              <span>Add Track</span>
            </NavLink>
            <NavLink to="/manage" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fas fa-sliders-h"></i>
              <span>Manage Library</span>
            </NavLink>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        {user ? (
          <div className="user-profile">
            <div className="user-badge">
              <i className="fas fa-user-circle"></i>
              <span>{user.username}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout" title="Log out">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        ) : (
          <div className="user-profile">
            <NavLink to="/login" className="user-badge" style={{ textDecoration: 'none' }}>
              <i className="fas fa-user-circle"></i>
              <span>Log In</span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  const [toastMessage, setToastMessage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    socket.on('new_activity', (data) => {
      setToastMessage(data.message);
      setTimeout(() => setToastMessage(null), 5000);
    });

    return () => {
      socket.off('new_activity');
    };
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {toastMessage && user && (
          <div className="socket-toast">
            <i className="fas fa-bell"></i> {toastMessage}
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <AddTrack />
            </ProtectedRoute>
          } />
          <Route path="/manage" element={
            <ProtectedRoute>
              <ManageLibrary />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
