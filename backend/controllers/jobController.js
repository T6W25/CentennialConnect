import Job from '../models/jobModel.js';
import JobApplication from '../models/jobApplicationModel.js';
import asyncHandler from 'express-async-handler';
import { isValidObjectId } from 'mongoose';

const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    description,
    requirements,
    type,
    salary,
    contactEmail,
    deadline,
    isRemote,
    skills,
  } = req.body;

  const job = await Job.create({
    title,
    company,
    location,
    description,
    requirements,
    type,
    salary: salary || 'Not specified',
    contactEmail,
    postedBy: req.user._id,
    deadline,
    isRemote: isRemote || false,
    skills: skills || [],
  });

  if (job) {
    res.status(201).json(job);
  } else {
    res.status(400);
    throw new Error('Invalid job data');
  }
});

const getJobs = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const filters = { status: 'Open' };

  if (req.query.type) filters.type = req.query.type;
  if (req.query.isRemote === 'true') filters.isRemote = true;
  if (req.query.location) {
    filters.location = { $regex: req.query.location, $options: 'i' };
  }

  const count = await Job.countDocuments(filters);

  const jobs = await Job.find(filters)
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    jobs,
    page,
    pages: Math.ceil(count / pageSize),
    totalJobs: count,
  });
});

const getJobById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

const updateJob = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid job ID');
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await JobApplication.deleteMany({ job: req.params.id });
  await job.remove();

  res.json({ message: 'Job removed' });
});

const searchJobs = asyncHandler(async (req, res) => {
  const { query, location, type, remote } = req.query;
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const filter = { status: 'Open' };

  if (query) {
    filter.$text = { $search: query };
  }

  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }

  if (type) {
    filter.type = type;
  }

  if (remote === 'true') {
    filter.isRemote = true;
  }

  const count = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .populate('postedBy', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    jobs,
    page,
    pages: Math.ceil(count / pageSize),
    totalJobs: count,
  });
});

const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  getMyJobs,
};
