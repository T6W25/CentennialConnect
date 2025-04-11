import asyncHandler from 'express-async-handler';
import Announcement from '../models/announcementModel.js';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, community, pinned } = req.body;

  // Validation to check for required fields
  if (!title || !message || !community) {
    res.status(400);
    throw new Error('Title, message, and community are required');
  }

  const announcement = await Announcement.create({
    title,
    message,
    community,
    pinned: pinned || false,
    createdBy: req.user._id,
  });

  res.status(201).json(announcement);
});

// @desc    Get all announcements for a specific community
// @route   GET /api/announcements/:communityId
// @access  Private
const getAnnouncementsByCommunity = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const announcements = await Announcement.find({ community: communityId })
    .populate('createdBy', 'name')
    .sort({ pinned: -1, createdAt: -1 });

  res.json(announcements);
});

export { createAnnouncement, getAnnouncementsByCommunity };
