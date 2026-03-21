import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_HELP_REQUESTS } from '../graphql/queries.js';
import {
  CREATE_HELP_REQUEST,
  RESOLVE_HELP_REQUEST,
  VOLUNTEER_FOR_REQUEST
} from '../graphql/mutations.js';

const HelpRequests = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: '', location: '' });
  const [formError, setFormError] = useState('');
  const [filter, setFilter] = useState(undefined); // undefined = all

  const { data, loading, error, refetch } = useQuery(GET_HELP_REQUESTS, {
    variables: { resolved: filter ?? null }
  });

  const [createRequest, { loading: creating }] = useMutation(CREATE_HELP_REQUEST, {
    onCompleted: () => {
      setForm({ description: '', location: '' });
      setShowForm(false);
      refetch();
    },
    onError: (err) => setFormError(err.message)
  });

  const [resolveRequest] = useMutation(RESOLVE_HELP_REQUEST, { onCompleted: refetch });
  const [volunteerRequest] = useMutation(VOLUNTEER_FOR_REQUEST, { onCompleted: refetch });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) { setFormError('Description is required.'); return; }
    setFormError('');
    createRequest({ variables: { description: form.description, location: form.location || null } });
  };

  if (loading) return <div className="loading-state">Loading help requests…</div>;
  if (error) return <div className="error-state">Error: {error.message}</div>;

  const requests = data?.helpRequests ?? [];

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Help Requests</h2>
          <p className="section-desc">Ask for or offer help within the community.</p>
        </div>
        {currentUser && (
          <button className="btn-add" onClick={() => { setShowForm(!showForm); setFormError(''); }}>
            {showForm ? '✕ Cancel' : '+ Request Help'}
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {[
          { label: 'All', value: undefined },
          { label: 'Open', value: false },
          { label: 'Resolved', value: true }
        ].map(({ label, value }) => (
          <button
            key={label}
            className={`filter-tab ${filter === value ? 'active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Request Community Help</h3>
          {formError && <div className="error-banner">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what help you need…"
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Location <span className="optional">(optional)</span></label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Main St & 1st Ave"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="empty-state">
          <span></span>
          <p>No help requests found.</p>
        </div>
      ) : (
        <div className="help-list">
          {requests.map((req) => {
            const hasVolunteered = req.volunteers?.includes(currentUser?.id);
            return (
              <div key={req.id} className={`help-card ${req.isResolved ? 'resolved' : 'open'}`}>
                <div className="post-meta">
                  <span className={`status-badge ${req.isResolved ? 'resolved' : 'open'}`}>
                    {req.isResolved ? 'Resolved' : 'Open'}
                  </span>
                  <time>{new Date(req.createdAt).toLocaleDateString()}</time>
                </div>

                <p className="help-description">{req.description}</p>

                {req.location && (
                  <p className="help-location">{req.location}</p>
                )}

                <p className="help-volunteers">
                  {req.volunteers?.length ?? 0} volunteer{req.volunteers?.length !== 1 ? 's' : ''}
                </p>

                {currentUser && !req.isResolved && (
                  <div className="help-actions">
                    {currentUser.id === req.author && (
                      <button
                        className="btn-resolve"
                        onClick={() => resolveRequest({ variables: { id: req.id } })}
                      >
                        Mark Resolved
                      </button>
                    )}
                    {currentUser.id !== req.author && !hasVolunteered && (
                      <button
                        className="btn-volunteer"
                        onClick={() => volunteerRequest({ variables: { id: req.id } })}
                      >
                        Volunteer
                      </button>
                    )}
                    {hasVolunteered && (
                      <span className="volunteered-label">You volunteered</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HelpRequests;
