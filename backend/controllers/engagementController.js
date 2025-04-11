import asyncHandler from 'express-async-handler';
import Engagement from '../models/engagementModel.js';

const logEngagement = asyncHandler(async (req, res) => {
  const { page, duration, actions } = req.body;

  const engagement = new Engagement({
    user: req.user._id,
    page,
    duration,
    actions
  });

  const saved = await engagement.save();
  res.status(201).json(saved);
});

const getEngagementStats = asyncHandler(async (req, res) => {
  const stats = await Engagement.aggregate([
    {
      $group: {
        _id: '$page',
        totalViews: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        avgDuration: { $avg: '$duration' }
      }
    },
    { $sort: { totalViews: -1 } }
  ]);

  res.json(stats);
});

export { logEngagement, getEngagementStats };
