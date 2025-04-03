// routes/jobRoutes.js
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
import { applyForJob, getJobApplications } from '../controllers/jobApplicationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Job routes
router.route('/')
  .post(protect, restrictTo('non-academic'), createJob)
  .get(getJobs);

router.get('/search', searchJobs);
router.get('/myjobs', protect, getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

// Job application routes
router.route('/:id/apply')
  .post(protect, applyForJob);

router.route('/:id/applications')
  .get(protect, getJobApplications);

export default router;