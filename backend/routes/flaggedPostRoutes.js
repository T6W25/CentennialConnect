import express from 'express';
import {
  flagPost,
  getFlaggedPosts,
  updateFlaggedStatus,
} from '../controllers/flaggedPostController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, flagPost);
router.get('/', protect, restrictTo('community-manager'), getFlaggedPosts);
router.put('/:id', protect, restrictTo('community-manager'), updateFlaggedStatus);

export default router;
