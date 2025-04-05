import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
  getMyJobs,
} from '../controllers/jobController.js';

import {
  applyForJob,
  getJobApplications,
} from '../controllers/jobApplicationController.js';

import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// publics
router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/:id', getJobById);

// authenticated user
router.post('/', protect, restrictTo('non-academic'), createJob);
router.get('/myjobs', protect, getMyJobs);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

// job application
router.post('/:id/apply', protect, applyForJob);
router.get('/:id/applications', protect, getJobApplications);

export default router;
