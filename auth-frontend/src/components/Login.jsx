import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations.js';
import { useAuth } from '../context/AuthContext.jsx';

const Login = ({ onSwitchToSignup }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const { data } = await loginMutation({ variables: form });
      login(data.login.token, data.login.user);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      <p className="auth-subtitle">Sign in to your community account</p>

      {errors.general && <div className="error-banner">{errors.general}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={errors.email ? 'input-error' : ''}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={errors.password ? 'input-error' : ''}
            autoComplete="current-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Sign In'}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button className="link-btn" onClick={onSwitchToSignup} type="button">
          Create one
        </button>
      </p>
    </div>
  );
};

export default Login;
