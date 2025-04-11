import express from 'express';
import {
  createReportedContent,
  getReportedContent,
  updateReportedContentStatus,
} from '../controllers/reportedContentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReportedContent)
  .get(protect, admin, getReportedContent);

router.route('/:id/status')
  .put(protect, admin, updateReportedContentStatus);

export default router;
