import express from 'express';
import { logTracking, getTrackingLogs } from '../controllers/trackingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(logTracking) // No auth required to log
  .get(protect, admin, getTrackingLogs);

export default router;
