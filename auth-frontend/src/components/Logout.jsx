import React from 'react';
import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from '../graphql/mutations.js';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_LABELS = {
  resident: 'Resident',
  business_owner: 'Business Owner',
  community_organizer: 'Community Organizer'
};

const Logout = () => {
  const { user, logout } = useAuth();
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    try {
      await logoutMutation();
    } finally {
      logout();
    }
  };

  return (
    <div className="user-panel">
      <div className="avatar">{user?.username?.[0]?.toUpperCase()}</div>
      <div className="user-details">
        <span className="user-name">{user?.username}</span>
        <span className="user-role">{ROLE_LABELS[user?.role] ?? user?.role}</span>
        <span className="user-email">{user?.email}</span>
      </div>
      <button className="btn-logout" onClick={handleLogout} disabled={loading} type="button">
        {loading ? 'Signing out…' : 'Sign Out'}
      </button>
    </div>
  );
};

export default Logout;
