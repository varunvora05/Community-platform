import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: null
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  volunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model('HelpRequest', helpRequestSchema);
