import CommunityPost from '../models/CommunityPost.js';
import HelpRequest from '../models/HelpRequest.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getAuthenticatedUser = (context) => {
  const token = context.req?.headers?.authorization || '';
  if (!token) throw new Error('Not authenticated');
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

const resolvers = {
  Query: {
    getPosts: async () => {
      return await CommunityPost.find()
        .populate('author', 'username email role')
        .sort({ createdAt: -1 });
    },
    getPost: async (_, { id }) => {
      return await CommunityPost.findById(id)
        .populate('author', 'username email role');
    },
    getHelpRequests: async () => {
      return await HelpRequest.find()
        .populate('author', 'username email role')
        .populate('volunteers', 'username email')
        .sort({ createdAt: -1 });
    },
    getHelpRequest: async (_, { id }) => {
      return await HelpRequest.findById(id)
        .populate('author', 'username email role')
        .populate('volunteers', 'username email');
    },
  },
  Mutation: {
    createPost: async (_, { title, content, category }, context) => {
      if (!title?.trim() || !content?.trim()) {
        throw new Error('Title and content are required');
      }
      if (!['news', 'discussion'].includes(category)) {
        throw new Error('Category must be either "news" or "discussion"');
      }
      
      const author = getAuthenticatedUser(context);
      const post = await CommunityPost.create({ author, title, content, category });
      return await post.populate('author', 'username email role');
    },
    updatePost: async (_, { id, title, content, aiSummary }, context) => {
      if (!title?.trim() || !content?.trim()) {
        throw new Error('Title and content are required');
      }
      
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Post not found');
      
      const userId = getAuthenticatedUser(context);
      if (post.author.toString() !== userId) {
        throw new Error('Not authorized to update this post');
      }
      
      const updated = await CommunityPost.findByIdAndUpdate(
        id,
        { title, content, aiSummary, updatedAt: new Date() },
        { new: true }
      ).populate('author', 'username email role');
      
      return updated;
    },
    deletePost: async (_, { id }, context) => {
      const post = await CommunityPost.findById(id);
      if (!post) throw new Error('Post not found');
      
      const userId = getAuthenticatedUser(context);
      if (post.author.toString() !== userId) {
        throw new Error('Not authorized to delete this post');
      }
      
      await CommunityPost.findByIdAndDelete(id);
      return 'Post deleted successfully';
    },
    createHelpRequest: async (_, { description, location }, context) => {
      if (!description?.trim()) {
        throw new Error('Description is required');
      }
      
      const author = getAuthenticatedUser(context);
      const helpRequest = await HelpRequest.create({ author, description, location });
      return await helpRequest.populate('author', 'username email role');
    },
    resolveHelpRequest: async (_, { id }, context) => {
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');
      
      const userId = getAuthenticatedUser(context);
      if (helpRequest.author.toString() !== userId) {
        throw new Error('Not authorized to resolve this request');
      }
      
      const updated = await HelpRequest.findByIdAndUpdate(
        id,
        { isResolved: true, updatedAt: new Date() },
        { new: true }
      ).populate('author', 'username email role')
       .populate('volunteers', 'username email');
      
      return updated;
    },
    volunteerForHelp: async (_, { id }, context) => {
      const userId = getAuthenticatedUser(context);
      
      const helpRequest = await HelpRequest.findById(id);
      if (!helpRequest) throw new Error('Help request not found');
      
      const updated = await HelpRequest.findByIdAndUpdate(
        id,
        { $addToSet: { volunteers: userId }, updatedAt: new Date() },
        { new: true }
      ).populate('author', 'username email role')
       .populate('volunteers', 'username email');
      
      return updated;
    },
  },
};

export default resolvers;