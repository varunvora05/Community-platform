import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client/core';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import './CommunityApp.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:4002/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const GET_POSTS         = gql`query { getPosts { id author { id username email role } title content category aiSummary createdAt } }`;
const GET_HELP_REQUESTS = gql`query { getHelpRequests { id author { id username email role } description location isResolved volunteers { id username email } createdAt } }`;
const CREATE_POST       = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id author { id username email role } title content category createdAt
    }
  }
`;
const CREATE_HELP = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id author { id username email role } description location isResolved createdAt
    }
  }
`;
const RESOLVE_HELP = gql`
  mutation ResolveHelpRequest($id: ID!) {
    resolveHelpRequest(id: $id) { id isResolved }
  }
`;
const VOLUNTEER_HELP = gql`
  mutation VolunteerForHelp($id: ID!) {
    volunteerForHelp(id: $id) { 
      id 
      volunteers { id username email }
    }
  }
`;

function Posts({ userId }) {
  const { data, loading, refetch } = useQuery(GET_POSTS, { client });
  const [createPost] = useMutation(CREATE_POST, { client });
  const [form, setForm] = useState({ title: '', content: '', category: 'news' });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ variables: { title: form.title, content: form.content, category: form.category } });
      setForm({ title: '', content: '', category: 'news' });
      setShowForm(false);
      refetch();
    } catch (err) {
      alert('Error creating post: ' + err.message);
    }
  };

  if (loading) return <div className="loading-text">Loading posts...</div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2>📰 Community Posts</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <input placeholder="Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Content" value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })} required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="news">News</option>
            <option value="discussion">Discussion</option>
          </select>
          <button type="submit">Post</button>
        </form>
      )}

      <div className="cards-grid">
        {data?.getPosts?.map(post => (
          <div key={post.id} className={`card ${post.category}`}>
            <span className="badge">{post.category}</span>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.aiSummary && <div className="ai-summary">🤖 {post.aiSummary}</div>}
            <div className="post-meta">
              <small>👤 {post.author?.username}</small>
              <small>{new Date(Number(post.createdAt)).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpRequests({ userId }) {
  const { data, loading, refetch } = useQuery(GET_HELP_REQUESTS, { client });
  const [createHelp]  = useMutation(CREATE_HELP,  { client });
  const [resolveHelp] = useMutation(RESOLVE_HELP, { client });
  const [volunteerHelp] = useMutation(VOLUNTEER_HELP, { client });
  const [form, setForm]     = useState({ description: '', location: '' });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHelp({ variables: { description: form.description, location: form.location } });
      setForm({ description: '', location: '' });
      setShowForm(false);
      refetch();
    } catch (err) {
      alert('Error creating help request: ' + err.message);
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveHelp({ variables: { id } });
      refetch();
    } catch (err) {
      alert('Error resolving request: ' + err.message);
    }
  };

  const handleVolunteer = async (id) => {
    try {
      await volunteerHelp({ variables: { id } });
      refetch();
    } catch (err) {
      alert('Error volunteering: ' + err.message);
    }
  };

  if (loading) return <div className="loading-text">Loading help requests...</div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2>🆘 Help Requests</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Request Help'}
        </button>
      </div>

      {showForm && (
        <form className="post-form" onSubmit={handleSubmit}>
          <textarea placeholder="Describe what you need help with..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} required />
          <input placeholder="Location (optional)" value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })} />
          <button type="submit">Submit Request</button>
        </form>
      )}

      <div className="cards-grid">
        {data?.getHelpRequests?.map(req => (
          <div key={req.id} className={`card help ${req.isResolved ? 'resolved' : ''}`}>
            <span className="badge">{req.isResolved ? '✅ Resolved' : '🔴 Open'}</span>
            <p>{req.description}</p>
            {req.location && <p className="location">📍 {req.location}</p>}
            <div className="request-meta">
              <small>👤 {req.author?.username}</small>
              <small>{req.volunteers?.length || 0} volunteers</small>
            </div>
            <small>{new Date(Number(req.createdAt)).toLocaleDateString()}</small>
            <div className="action-buttons">
              {!req.isResolved && (
                <>
                  <button className="resolve-btn" onClick={() => handleResolve(req.id)}>
                    Mark Resolved
                  </button>
                  <button className="volunteer-btn" onClick={() => handleVolunteer(req.id)}>
                    Volunteer
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityDashboard({ userId }) {
  const [tab, setTab] = useState('posts');
  return (
    <div className="dashboard">
      <div className="tabs">
        <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>
          📰 Posts
        </button>
        <button className={tab === 'help' ? 'active' : ''} onClick={() => setTab('help')}>
          🆘 Help Requests
        </button>
      </div>
      {tab === 'posts' ? <Posts userId={userId} /> : <HelpRequests userId={userId} />}
    </div>
  );
}

export default function CommunityApp({ userId }) {
  return (
    <ApolloProvider client={client}>
      <CommunityDashboard userId={userId} />
    </ApolloProvider>
  );
}