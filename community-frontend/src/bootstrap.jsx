import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const currentUser = (() => {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App currentUser={currentUser} />
  </React.StrictMode>
);
