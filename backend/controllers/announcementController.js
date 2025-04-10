import asyncHandler from 'express-async-handler';
import Announcement from '../models/announcementModel.js';

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, community, pinned } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    community,
    pinned: pinned || false,
    createdBy: req.user._id,
  });

  res.status(201).json(announcement);
});

const getAnnouncementsByCommunity = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const announcements = await Announcement.find({ community: communityId })
    .populate('createdBy', 'name')
    .sort({ pinned: -1, createdAt: -1 });

  res.json(announcements);
});

export { createAnnouncement, getAnnouncementsByCommunity };
