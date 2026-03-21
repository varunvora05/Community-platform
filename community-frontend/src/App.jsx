import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client.js';
import NewsFeed from './components/NewsFeed.jsx';
import Discussions from './components/Discussions.jsx';
import HelpRequests from './components/HelpRequests.jsx';
import './index.css';

const TABS = [
  { id: 'news', label: 'News' },
  { id: 'discussions', label: 'Discussions' },
  { id: 'help', label: 'Help Requests' }
];

const CommunityContent = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div className="community-wrapper">
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {activeTab === 'news'        && <NewsFeed currentUser={currentUser} />}
        {activeTab === 'discussions' && <Discussions currentUser={currentUser} />}
        {activeTab === 'help'        && <HelpRequests currentUser={currentUser} />}
      </div>
    </div>
  );
};

// currentUser prop is passed from the host-app so the community features
// know who is logged in (for create/resolve/volunteer actions).
const App = ({ currentUser }) => (
  <ApolloProvider client={client}>
    <CommunityContent currentUser={currentUser} />
  </ApolloProvider>
);

export default App;
