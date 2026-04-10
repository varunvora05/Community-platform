import React from 'react';
import ReactDOM from 'react-dom/client';
import CommunityApp from './CommunityApp.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CommunityApp userId="test-user-id" />
  </React.StrictMode>
);