import express from 'express';
import { createViolation, getUserViolations, resolveViolation } from '../controllers/violationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createViolation);
router.get('/:id', protect, restrictTo('admin'), getUserViolations);
router.put('/resolve/:id', protect, restrictTo('admin'), resolveViolation);

export default router;
