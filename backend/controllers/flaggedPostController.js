import asyncHandler from 'express-async-handler';
import FlaggedPost from '../models/flaggedPostModel.js';

const flagPost = asyncHandler(async (req, res) => {
  const { postId, reason } = req.body;
  const flagged = await FlaggedPost.create({
    post: postId,
    reportedBy: req.user._id,
    reason,
  });
  res.status(201).json(flagged);
});

const getFlaggedPosts = asyncHandler(async (req, res) => {
  const flagged = await FlaggedPost.find()
    .populate('post')
    .populate('reportedBy', 'name');
  res.json(flagged);
});

const updateFlaggedStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await FlaggedPost.findByIdAndUpdate(id, { status }, { new: true });
  res.json(updated);
});

export { flagPost, getFlaggedPosts, updateFlaggedStatus };
