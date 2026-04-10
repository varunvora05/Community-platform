import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const resolvers = {
  Query: {
    me: async (_, __, { req }) => {
      const token = req.headers.authorization || '';
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      return await User.findById(decoded.id);
    },
  },
  Mutation: {
    signup: async (_, { username, email, password, role }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error('Email already in use');
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed, role });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Incorrect password');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    logout: () => 'Logged out successfully',
  },
};

export default resolvers;