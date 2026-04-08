
//Update for other course 
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { getUser } from './utils/auth.js';

dotenv.config();

const app = express();

// Manual CORS middleware — the 'cors' package is intentionally not used.
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      const user = getUser(token);
      return { user };
    }
  })
);

try {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/community_db');
  console.log('✅ Community Service connected to MongoDB.');
} catch (err) {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
}

const PORT = process.env.PORT ?? 4002;
app.listen(PORT, () => {
  console.log(`🚀 Community Service ready at http://localhost:${PORT}/graphql`);
});
