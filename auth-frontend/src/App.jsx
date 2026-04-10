import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Logout from './components/Logout.jsx';
import './index.css';

const AuthContent = () => {
  const [view, setView] = useState('login');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Logout />;
  if (view === 'login') return <Login onSwitchToSignup={() => setView('signup')} />;
  return <Signup onSwitchToLogin={() => setView('login')} />;
};

// App is exported as a remote — it includes its own ApolloProvider and AuthProvider
// so it is fully self-contained whether run standalone or via Module Federation.
const App = () => (
  <ApolloProvider client={client}>
    <AuthProvider>
      <div className="auth-container">
        <AuthContent />
      </div>
    </AuthProvider>
  </ApolloProvider>
);

export default App;
