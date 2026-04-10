import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthApp from './AuthApp.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthApp onLogin={(token) => console.log('token:', token)} />
  </React.StrictMode>
);