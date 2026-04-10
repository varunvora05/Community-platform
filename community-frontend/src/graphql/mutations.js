import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
      author
      title
      content
      category
      createdAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String, $aiSummary: String) {
    updatePost(id: $id, title: $title, content: $content, aiSummary: $aiSummary) {
      id
      title
      content
      aiSummary
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id
      author
      description
      location
      isResolved
      createdAt
    }
  }
`;

export const RESOLVE_HELP_REQUEST = gql`
  mutation ResolveHelpRequest($id: ID!) {
    resolveHelpRequest(id: $id) {
      id
      isResolved
      updatedAt
    }
  }
`;

export const VOLUNTEER_FOR_REQUEST = gql`
  mutation VolunteerForRequest($id: ID!) {
    volunteerForRequest(id: $id) {
      id
      volunteers
      updatedAt
    }
  }
`;
