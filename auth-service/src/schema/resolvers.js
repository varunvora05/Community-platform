import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';

const ALLOWED_ROLES = ['resident', 'business_owner', 'community_organizer'];
const SALT_ROUNDS = 12;

export const resolvers = {
  User: {
    id: (u) => u._id?.toString() ?? u.id,
    createdAt: (u) =>
      u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt)
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      return User.findById(user.id);
    }
  },

  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      if (!ALLOWED_ROLES.includes(role)) {
        throw new GraphQLError('Invalid role provided.', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        throw new GraphQLError('Username or email already in use.', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      if (password.length < 6) {
        throw new GraphQLError('Password must be at least 6 characters.', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({ username, email, password: hashedPassword, role });
      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('Invalid credentials.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new GraphQLError('Invalid credentials.', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const token = generateToken(user);
      return { token, user };
    },

    logout: () => true
  }
};
