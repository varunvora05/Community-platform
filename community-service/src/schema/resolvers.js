import { GraphQLError } from 'graphql';
import CommunityPost from '../models/CommunityPost.js';
import HelpRequest from '../models/HelpRequest.js';

const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError('Authentication required.', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
};

const toIso = (date) => (date instanceof Date ? date.toISOString() : date ? String(date) : null);

export const resolvers = {
  Post: {
    id: (p) => p._id?.toString() ?? p.id,
    author: (p) => p.author?.toString(),
    createdAt: (p) => toIso(p.createdAt) ?? '',
    updatedAt: (p) => toIso(p.updatedAt)
  },

  HelpRequest: {
    id: (h) => h._id?.toString() ?? h.id,
    author: (h) => h.author?.toString(),
    volunteers: (h) => (h.volunteers ?? []).map((v) => v?.toString()),
    createdAt: (h) => toIso(h.createdAt) ?? '',
    updatedAt: (h) => toIso(h.updatedAt)
  },

  Query: {
    posts: async (_, { category }) => {
      const filter = category ? { category } : {};
      return CommunityPost.find(filter).sort({ createdAt: -1 });
    },

    post: async (_, { id }) => CommunityPost.findById(id),

    helpRequests: async (_, { resolved }) => {
      const filter = resolved !== undefined && resolved !== null ? { isResolved: resolved } : {};
      return HelpRequest.find(filter).sort({ createdAt: -1 });
    },

    helpRequest: async (_, { id }) => HelpRequest.findById(id)
  },

  Mutation: {
    createPost: async (_, { title, content, category }, { user }) => {
      requireAuth(user);
      if (!['news', 'discussion'].includes(category)) {
        throw new GraphQLError('Category must be "news" or "discussion".', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      return CommunityPost.create({ author: user.id, title, content, category });
    },

    updatePost: async (_, { id, title, content, aiSummary }, { user }) => {
      requireAuth(user);
      const post = await CommunityPost.findById(id);
      if (!post) {
        throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (post.author.toString() !== user.id) {
        throw new GraphQLError('You are not the author of this post.', {
          extensions: { code: 'FORBIDDEN' }
        });
      }
      const updates = { updatedAt: new Date() };
      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = content;
      if (aiSummary !== undefined) updates.aiSummary = aiSummary;
      return CommunityPost.findByIdAndUpdate(id, updates, { new: true });
    },

    deletePost: async (_, { id }, { user }) => {
      requireAuth(user);
      const post = await CommunityPost.findById(id);
      if (!post) {
        throw new GraphQLError('Post not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (post.author.toString() !== user.id) {
        throw new GraphQLError('You are not the author of this post.', {
          extensions: { code: 'FORBIDDEN' }
        });
      }
      await CommunityPost.findByIdAndDelete(id);
      return true;
    },

    createHelpRequest: async (_, { description, location }, { user }) => {
      requireAuth(user);
      return HelpRequest.create({ author: user.id, description, location: location ?? null });
    },

    resolveHelpRequest: async (_, { id }, { user }) => {
      requireAuth(user);
      const req = await HelpRequest.findById(id);
      if (!req) {
        throw new GraphQLError('Help request not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (req.author.toString() !== user.id) {
        throw new GraphQLError('Only the author can resolve this request.', {
          extensions: { code: 'FORBIDDEN' }
        });
      }
      return HelpRequest.findByIdAndUpdate(
        id,
        { isResolved: true, updatedAt: new Date() },
        { new: true }
      );
    },

    volunteerForRequest: async (_, { id }, { user }) => {
      requireAuth(user);
      const req = await HelpRequest.findById(id);
      if (!req) {
        throw new GraphQLError('Help request not found.', { extensions: { code: 'NOT_FOUND' } });
      }
      if (req.isResolved) {
        throw new GraphQLError('This request is already resolved.', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      const alreadyVolunteered = req.volunteers.some((v) => v.toString() === user.id);
      if (alreadyVolunteered) {
        throw new GraphQLError('You have already volunteered for this request.', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }
      return HelpRequest.findByIdAndUpdate(
        id,
        { $push: { volunteers: user.id }, updatedAt: new Date() },
        { new: true }
      );
    }
  }
};
