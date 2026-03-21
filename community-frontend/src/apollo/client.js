import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';

// Attach the JWT token from localStorage to every outgoing request.
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('auth_token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }));
  return forward(operation);
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4002/graphql'
});

const client = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
