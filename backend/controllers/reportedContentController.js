import asyncHandler from 'express-async-handler';
import ReportedContent from '../models/reportedContentModel.js';

const createReportedContent = asyncHandler(async (req, res) => {
  const { contentType, contentId, reason } = req.body;

  if (!contentType || !contentId || !reason) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  const report = await ReportedContent.create({
    reporter: req.user._id,
    contentType,
    contentId,
    reason,
  });

  res.status(201).json(report);
});

const getReportedContent = asyncHandler(async (req, res) => {
  const reports = await ReportedContent.find({})
    .populate('reporter', 'name email')
    .sort({ createdAt: -1 });

  res.json(reports);
});

const updateReportedContentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'reviewed', 'dismissed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const report = await ReportedContent.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Reported content not found');
  }

  report.status = status;
  const updated = await report.save();
  res.json(updated);
});

export {
  createReportedContent,
  getReportedContent,
  updateReportedContentStatus,
};
