import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import './index.css';

const AuthApp      = lazy(() => import('auth_frontend/AuthApp'));
const CommunityApp = lazy(() => import('community_frontend/CommunityApp'));

const MFLoader = ({ label }) => (
  <div className="mf-loading">
    <div className="mf-spinner" />
    <p>Loading {label}…</p>
  </div>
);

const App = () => {
  const [section, setSection] = useState('auth');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Track whether the user manually chose 'auth' while logged in
  // so the poll does not override their navigation back to Account.
  const manualAuthNav = useRef(false);

  const handleNavAuth = () => {
    manualAuthNav.current = true;
    setSection('auth');
  };

  const handleNavCommunity = () => {
    manualAuthNav.current = false;
    setSection('community');
  };

  // Poll localStorage so login / logout in the auth MFE is reflected here.
  useEffect(() => {
    const sync = () => {
      try {
        const saved = localStorage.getItem('auth_user');
        const user = saved ? JSON.parse(saved) : null;

        setCurrentUser((prev) => {
          // Only redirect to community on first login (prev was null)
          if (!prev && user) {
            manualAuthNav.current = false;
            setSection('community');
          }
          // On logout always go to auth
          if (prev && !user) {
            manualAuthNav.current = false;
            setSection('auth');
          }
          return user;
        });
      } catch { /* ignore */ }
    };

    window.addEventListener('storage', sync);
    const timer = setInterval(sync, 500);
    return () => { window.removeEventListener('storage', sync); clearInterval(timer); };
  }, []);

  return (
    <div className="host-root">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">CL</div>
          <div>
            <span className="brand-name">Community Platform</span>
            <span className="brand-tagline">Neighborhood Action Network</span>
          </div>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-btn ${section === 'auth' ? 'active' : ''}`}
            onClick={handleNavAuth}
          >
            {currentUser ? 'Account' : 'Sign In'}
          </button>
          {currentUser && (
            <button
              className={`nav-btn ${section === 'community' ? 'active' : ''}`}
              onClick={handleNavCommunity}
            >
              Community
            </button>
          )}
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {/* Auth micro frontend — always mounted so it can detect logout */}
        <div className={`mf-pane ${section === 'auth' ? 'visible' : 'hidden'}`}>
          <Suspense fallback={<MFLoader label="authentication" />}>
            <AuthApp />
          </Suspense>
        </div>

        {/* Community micro frontend — only rendered after login */}
        {currentUser && (
          <div className={`mf-pane ${section === 'community' ? 'visible' : 'hidden'}`}>
            <Suspense fallback={<MFLoader label="community" />}>
              <CommunityApp currentUser={currentUser} />
            </Suspense>
          </div>
        )}

        {/* Welcome splash for unauthenticated visitors */}
        {!currentUser && section === 'community' && (
          <div className="splash">
            <div className="splash-icon" aria-hidden="true" />
            <h2>Sign in to access the community</h2>
            <button className="btn-primary" onClick={handleNavAuth}>Go to Sign In</button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <p>© 2025 NeighborNest · Built with Micro Frontends &amp; Microservices</p>
      </footer>
    </div>
  );
};

export default App;
