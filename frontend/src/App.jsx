import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AddTrack from './pages/AddTrack.jsx';
import ManageLibrary from './pages/ManageLibrary.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
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
            <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fas fa-plus-circle"></i>
              <span>Add Track</span>
            </NavLink>
            <NavLink to="/manage" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <i className="fas fa-sliders-h"></i>
              <span>Manage Library</span>
            </NavLink>
          </div>

          <div className="sidebar-footer">
            <div className="user-badge">
              <i className="fas fa-user-circle"></i>
              <span>Guest User</span>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTrack />} />
            <Route path="/manage" element={<ManageLibrary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
