import express from 'express';
import { submitRSVP, getEventRSVPs } from '../controllers/rsvpController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitRSVP);
router.get('/:eventId', protect, getEventRSVPs);

export default router;
