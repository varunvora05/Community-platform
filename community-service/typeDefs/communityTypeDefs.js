import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type CommunityPost {
    id: ID!
    author: User!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: User!
    description: String!
    location: String
    isResolved: Boolean!
    volunteers: [User]
    createdAt: String
    updatedAt: String
  }

  type Query {
    getPosts: [CommunityPost]
    getPost(id: ID!): CommunityPost
    getHelpRequests: [HelpRequest]
    getHelpRequest(id: ID!): HelpRequest
  }

  type Mutation {
    createPost(title: String!, content: String!, category: String!): CommunityPost!
    updatePost(id: ID!, title: String, content: String, aiSummary: String): CommunityPost!
    deletePost(id: ID!): String!
    createHelpRequest(description: String!, location: String): HelpRequest!
    resolveHelpRequest(id: ID!): HelpRequest!
    volunteerForHelp(id: ID!): HelpRequest!
  }
`;

export default typeDefs;