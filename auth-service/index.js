import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './typeDefs/userTypeDefs.js';
import resolvers from './resolvers/userResolvers.js';

dotenv.config();

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

await server.start();
server.applyMiddleware({ app });

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Auth DB connected');

app.listen(process.env.PORT, () => {
  console.log(`🚀 Auth Service running at http://localhost:${process.env.PORT}/graphql`);
});