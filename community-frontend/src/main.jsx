import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bootstrap pattern: defer execution so Module Federation can finish
// negotiating shared singletons (React) before any component code runs.
import('./bootstrap.jsx');

