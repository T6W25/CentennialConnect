import express from 'express';
import { uploadResume, getUserResumes, deleteResume } from '../controllers/resumeController.js';
import upload from '../middleware/uploadResumeMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, upload.single('resume'), uploadResume)
  .get(protect, getUserResumes);

router.route('/:id').delete(protect, deleteResume);

export default router;
