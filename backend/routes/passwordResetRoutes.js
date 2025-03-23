import express from 'express';
import { 
  requestPasswordReset, 
  resetPassword 
} from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.put('/reset-password/:token', resetPassword);

export default router;