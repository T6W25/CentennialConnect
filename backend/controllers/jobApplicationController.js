// controllers/jobApplicationController.js
import JobApplication from '../models/jobApplicationModel.js';
import Job from '../models/jobModel.js';
import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.status === 'Closed') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  // Check if user already applied
  const alreadyApplied = await JobApplication.findOne({
    job: req.params.id,
    applicant: req.user._id,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const { resume, coverLetter } = req.body;

  if (!resume) {
    res.status(400);
    throw new Error('Resume is required');
  }

  const application = await JobApplication.create({
    job: req.params.id,
    applicant: req.user._id,
    resume,
    coverLetter: coverLetter || '',
  });

  if (application) {
    // Add application to job's applications array
    await Job.findByIdAndUpdate(req.params.id, {
      $push: { applications: application._id },
    });
    
    res.status(201).json(application);
  } else {
    res.status(400);
    throw new Error('Invalid application data');
  }
});

// @desc    Get all applications for a job
// @route   GET /api/jobs/:id/applications
// @access  Private (only job creator)
const getJobApplications = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if user is the job creator
  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view these applications');
  }

  const applications = await JobApplication.find({ job: req.params.id })
    .populate('applicant', 'name email')
    .sort({ createdAt: -1 });

  res.json(applications);
});

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (job creator or applicant)
const getApplicationById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid application ID');
  }

  const application = await JobApplication.findById(req.params.id)
    .populate('applicant', 'name email')
    .populate({
      path: 'job',
      populate: {
        path: 'postedBy',
        select: 'name email',
      },
    });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if user is the job creator or the applicant
  const isJobCreator = application.job.postedBy._id.toString() === req.user._id.toString();
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();

  if (!isJobCreator && !isApplicant) {
    res.status(403);
    throw new Error('Not authorized to view this application');
  }

  res.json(application);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (only job creator)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid application ID');
  }

  const { status, notes } = req.body;

  const application = await JobApplication.findById(req.params.id).populate({
    path: 'job',
    select: 'postedBy',
  });

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if user is the job creator
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status || application.status;
  application.notes = notes || application.notes;

  const updatedApplication = await application.save();

  res.json(updatedApplication);
});

// @desc    Get all applications submitted by current user
// @route   GET /api/applications/myapplications
// @access  Private
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find({ applicant: req.user._id })
    .populate({
      path: 'job',
      select: 'title company location status deadline',
    })
    .sort({ createdAt: -1 });

  res.json(applications);
});

export {
  applyForJob,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  getMyApplications,
};