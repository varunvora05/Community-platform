import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../graphql/mutations.js';
import { useAuth } from '../context/AuthContext.jsx';

const ROLES = [
  { value: 'resident', label: 'Resident' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'community_organizer', label: 'Community Organizer' }
];

const Signup = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const [signupMutation, { loading }] = useMutation(SIGNUP_MUTATION);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required.';
    else if (form.username.length < 3) errs.username = 'At least 3 characters.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.role) errs.role = 'Please select a role.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'At least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
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
      const { username, email, password, role } = form;
      const { data } = await signupMutation({ variables: { username, email, password, role } });
      login(data.signup.token, data.signup.user);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Join NeighborNest</h2>
      <p className="auth-subtitle">Create your free community account</p>

      {errors.general && <div className="error-banner">{errors.general}</div>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="su-username">Username</label>
          <input
            id="su-username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="johndoe"
            className={errors.username ? 'input-error' : ''}
            autoComplete="username"
          />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="su-email">Email address</label>
          <input
            id="su-email"
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
          <label htmlFor="su-role">Your role</label>
          <select
            id="su-role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className={errors.role ? 'input-error' : ''}
          >
            <option value="">Select a role…</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="su-password">Password</label>
            <input
              id="su-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className={errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="su-confirm">Confirm password</label>
            <input
              id="su-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className={errors.confirmPassword ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Create Account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <button className="link-btn" onClick={onSwitchToLogin} type="button">
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Signup;
