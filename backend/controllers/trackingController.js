import asyncHandler from 'express-async-handler';
import Tracking from '../models/trackingModel.js';

const logTracking = asyncHandler(async (req, res) => {
  const { page, action, details } = req.body;

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

const getTrackingLogs = asyncHandler(async (req, res) => {
  const logs = await Tracking.find().sort({ timestamp: -1 }).limit(100);
  res.json(logs);
});

export { logTracking, getTrackingLogs };
