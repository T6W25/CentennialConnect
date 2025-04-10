import express from 'express';
import { logEngagement, getEngagementStats } from '../controllers/engagementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, logEngagement);

router.route('/stats')
  .get(protect, admin, getEngagementStats);

export default router;
