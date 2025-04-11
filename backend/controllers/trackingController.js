import asyncHandler from 'express-async-handler';
import Tracking from '../models/trackingModel.js';

// @desc    Log tracking data (user actions on pages)
// @route   POST /api/tracking
// @access  Private
const logTracking = asyncHandler(async (req, res) => {
  const { page, action, details } = req.body;

  // Check if required fields are provided
  if (!page || !action) {
    res.status(400);
    throw new Error('Page and action are required');
  }

  const tracking = new Tracking({
    user: req.user?._id || null,
    page,
    action,
    details,
    userAgent: req.headers['user-agent']
  });

  const saved = await tracking.save();
  res.status(201).json(saved);
});

// @desc    Get tracking logs (latest 100)
// @route   GET /api/tracking
// @access  Private/Admin
const getTrackingLogs = asyncHandler(async (req, res) => {
  const logs = await Tracking.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

export { logTracking, getTrackingLogs };
