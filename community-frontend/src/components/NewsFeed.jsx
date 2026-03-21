import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries.js';
import { CREATE_POST, DELETE_POST } from '../graphql/mutations.js';

const NewsFeed = ({ currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    variables: { category: 'news' }
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
      setFormError('Title and content are required.');
      return;
    }
    setFormError('');
    createPost({ variables: { ...form, category: 'news' } });
  };

  if (loading) return <div className="loading-state">Loading news…</div>;
  if (error) return <div className="error-state">Error: {error.message}</div>;

  const posts = data?.posts ?? [];

  return (
    <div className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Community News</h2>
          <p className="section-desc">Stay up-to-date with local announcements.</p>
        </div>
        {currentUser && (
          <button className="btn-add" onClick={() => { setShowForm(!showForm); setFormError(''); }}>
            {showForm ? '✕ Cancel' : '+ Post News'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="create-form">
          <h3>Share Community News</h3>
          {formError && <div className="error-banner">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Headline</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Road closure on Main St this weekend"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the full news article here…"
                rows={5}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Publishing…' : 'Publish News'}
            </button>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <span></span>
          <p>No news yet — be the first to share something!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-meta">
                <span className="badge badge-news">News</span>
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              </div>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.content}</p>
              {post.aiSummary && (
                <div className="ai-summary">
                  <span className="ai-label">✨ AI Summary</span>
                  <p>{post.aiSummary}</p>
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

export default NewsFeed;
