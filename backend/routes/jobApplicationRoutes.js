// routes/jobApplicationRoutes.js
import express from 'express';
import { 
  getApplicationById,
  updateApplicationStatus,
  getMyApplications
} from '../controllers/jobApplicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/myapplications', protect, getMyApplications);

router.route('/:id')
  .get(protect, getApplicationById)
  .put(protect, updateApplicationStatus);

export default router;