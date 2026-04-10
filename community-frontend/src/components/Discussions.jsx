import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries.js';
import { CREATE_POST, DELETE_POST } from '../graphql/mutations.js';

const Discussions = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    variables: { category: 'discussion' }
  });

  const [createPost, { loading: creating }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setForm({ title: '', content: '' });
      setShowForm(false);
      refetch();
    },
    onError: (err) => setFormError(err.message)
  });

  const [deletePost] = useMutation(DELETE_POST, { onCompleted: refetch });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Topic and details are required.');
      return;
    }
    setFormError('');
    createPost({ variables: { ...form, category: 'discussion' } });
  };

  if (loading) return <div className="loading-state">Loading discussions…</div>;
  if (error) return <div className="error-state">Error: {error.message}</div>;

  const posts = data?.posts ?? [];

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Discussions</h2>
          <p className="section-desc">Share ideas, ask questions, spark conversations.</p>
        </div>
        {currentUser && (
          <button className="btn-add" onClick={() => { setShowForm(!showForm); setFormError(''); }}>
            {showForm ? '✕ Cancel' : '+ Start Discussion'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Start a Discussion</h3>
          {formError && <div className="error-banner">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Topic</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What do you want to discuss?"
              />
            </div>
            <div className="form-group">
              <label>Details</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Share your thoughts, questions, or ideas…"
                rows={5}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Posting…' : 'Post Discussion'}
            </button>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <span></span>
          <p>No discussions yet — start the conversation!</p>
        </div>
      ) : (
        <div className="discussions-list">
          {posts.map((post) => (
            <article key={post.id} className="discussion-card">
              <div className="post-meta">
                <span className="badge badge-discussion">Discussion</span>
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              </div>
              <button
                className="discussion-title-btn"
                onClick={() => setExpanded(expanded === post.id ? null : post.id)}
              >
                {post.title}
                <span className="chevron">{expanded === post.id ? '▲' : '▼'}</span>
              </button>
              {expanded === post.id && (
                <div className="discussion-body">
                  <p>{post.content}</p>
                  {post.aiSummary && (
                    <div className="ai-summary">
                      <span className="ai-label">✨ AI Summary</span>
                      <p>{post.aiSummary}</p>
                    </div>
                  )}
                  {post.updatedAt && (
                    <p className="updated-at">
                      Last edited: {new Date(post.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
              {currentUser?.id === post.author && (
                <button
                  className="btn-danger-sm"
                  onClick={() => deletePost({ variables: { id: post.id } })}
                >
                  Delete
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussions;
