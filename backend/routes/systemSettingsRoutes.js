import express from 'express';
import { getSettings, updateSettings } from '../controllers/systemSettingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSettings)
  .put(protect, admin, updateSettings);

export default router;
