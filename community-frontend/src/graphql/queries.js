import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($category: String) {
    posts(category: $category) {
      id
      author
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      author
      title
      content
      category
      aiSummary
      createdAt
      updatedAt
    }
  }
`;

export const GET_HELP_REQUESTS = gql`
  query GetHelpRequests($resolved: Boolean) {
    helpRequests(resolved: $resolved) {
      id
      author
      description
      location
      isResolved
      volunteers
      createdAt
      updatedAt
    }
  }
`;
