import express from 'express';
import { createAnnouncement, getAnnouncementsByCommunity } from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAnnouncement);
router.get('/:communityId', protect, getAnnouncementsByCommunity);

export default router;
