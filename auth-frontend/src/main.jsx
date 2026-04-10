<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthApp from './AuthApp.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthApp onLogin={(token) => console.log('token:', token)} />
  </React.StrictMode>
);
=======
// Bootstrap pattern: defer execution so Module Federation can finish
// negotiating shared singletons (React) before any component code runs.
import('./bootstrap.jsx');

>>>>>>> ff81d9ceeb2b33a29fbbae8dcd627f3ca2523e3b
