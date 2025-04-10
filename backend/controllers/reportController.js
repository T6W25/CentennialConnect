import asyncHandler from 'express-async-handler';
import Report from '../models/reportModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// @desc    Create a new report (user, post, or comment)
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { reportType, reportedId, reason, postId, commentId } = req.body;

  if (!reportType || !reason) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  if (reportType === 'user') {
    const user = await User.findById(reportedId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportType,
      reportedUser: reportedId,
      reason,
    });

    res.status(201).json(report);
  } else if (reportType === 'post') {
    const post = await Post.findById(reportedId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportType,
      reportedPost: reportedId,
      reason,
    });

    res.status(201).json(report);
  } else if (reportType === 'comment') {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportType,
      reportedComment: {
        post: postId,
        commentId,
      },
      reason,
    });

    res.status(201).json(report);
  } else {
    res.status(400);
    throw new Error('Invalid report type');
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({})
    .populate('reporter', 'name email profilePicture')
    .populate('reportedUser', 'name email profilePicture')
    .populate('reportedPost', 'title content')
    .populate({
      path: 'reportedComment.post',
      select: 'title content',
    })
    .sort({ createdAt: -1 });

  res.json(reports);
});

// @desc    Update report status (pending, resolved, dismissed)
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'resolved', 'dismissed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  report.status = status;
  const updatedReport = await report.save();

  res.json(updatedReport);
});

export { createReport, getReports, updateReportStatus };
