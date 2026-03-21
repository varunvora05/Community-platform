import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Absolute URL ensures the client works both standalone and when consumed
// by the host-app as a remote module. The backend handles cross-origin
// with manual Access-Control headers (no 'cors' package used).
const httpLink = createHttpLink({
  uri: 'http://localhost:4001/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;
