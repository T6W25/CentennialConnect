import mongoose from 'mongoose';

const reportedContentSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentType: {
    type: String,
    enum: ['post', 'comment', 'announcement'],
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const ReportedContent = mongoose.model('ReportedContent', reportedContentSchema);
export default ReportedContent;
