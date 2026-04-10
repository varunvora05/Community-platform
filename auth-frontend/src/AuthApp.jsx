import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { ApolloProvider, useMutation } from '@apollo/client/react';
import './AuthApp.css';

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
});

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      token
      user { id username email role }
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id username email role }
    }
  }
`;

function AuthForms({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ username: '', email: '', password: '', role: 'resident' });
  const [error, setError]     = useState('');

  const [signup] = useMutation(SIGNUP, { client });
  const [login]  = useMutation(LOGIN,  { client });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let result;
      if (isLogin) {
        result = await login({ variables: { email: form.email, password: form.password } });
        const { token, user } = result.data.login;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        onLogin(token);
      } else {
        result = await signup({ variables: form });
        const { token, user } = result.data.signup;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        onLogin(token);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? '🔐 Login' : '📝 Sign Up'}</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input name="username" placeholder="Username" value={form.username}
              onChange={handleChange} required />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email}
            onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password}
            onChange={handleChange} required />
          {!isLogin && (
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="resident">Resident</option>
              <option value="business_owner">Business Owner</option>
              <option value="community_organizer">Community Organizer</option>
            </select>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
}

export default function AuthApp({ onLogin }) {
  return (
    <ApolloProvider client={client}>
      <AuthForms onLogin={onLogin} />
    </ApolloProvider>
  );
}