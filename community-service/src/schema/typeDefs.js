export const typeDefs = `#graphql
  type Post {
    id: ID!
    author: ID!
    title: String!
    content: String!
    category: String!
    aiSummary: String
    createdAt: String!
    updatedAt: String
  }

  type HelpRequest {
    id: ID!
    author: ID!
    description: String!
    location: String
    isResolved: Boolean!
    volunteers: [ID!]
    createdAt: String!
    updatedAt: String
  }

  type Query {
    posts(category: String): [Post!]!
    post(id: ID!): Post
    helpRequests(resolved: Boolean): [HelpRequest!]!
    helpRequest(id: ID!): HelpRequest
  }

  type Mutation {
    createPost(title: String!, content: String!, category: String!): Post!
    updatePost(id: ID!, title: String, content: String, aiSummary: String): Post!
    deletePost(id: ID!): Boolean!

    createHelpRequest(description: String!, location: String): HelpRequest!
    resolveHelpRequest(id: ID!): HelpRequest!
    volunteerForRequest(id: ID!): HelpRequest!
  }
`;
