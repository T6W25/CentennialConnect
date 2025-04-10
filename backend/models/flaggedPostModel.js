import mongoose from 'mongoose';

const flaggedPostSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const FlaggedPost = mongoose.model('FlaggedPost', flaggedPostSchema);
export default FlaggedPost;
