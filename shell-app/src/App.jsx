import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

const AuthApp = lazy(() =>
  import('authFrontend/AuthApp').then(mod => ({ default: mod.default }))
);
const CommunityApp = lazy(() =>
  import('communityFrontend/CommunityApp').then(mod => ({ default: mod.default }))
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
  };

  return (
    <Router>
      <nav className="navbar">
        <h1 className="nav-brand">🏘️ CommunityHub</h1>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/community">Community</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/auth">Login / Sign Up</Link>
          )}
        </div>
      </nav>

      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/community' : '/auth'} />} />
          <Route path="/auth" element={<AuthApp onLogin={handleLogin} />} />
          <Route
            path="/community"
            element={
              token
                ? <CommunityApp userId={localStorage.getItem('userId')} />
                : <Navigate to="/auth" />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;