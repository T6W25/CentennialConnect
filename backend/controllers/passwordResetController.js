import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import generateToken from '../utils/generateToken.js';

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('No user found with this email');
  }

  // Generate password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and save to database
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token expiration to 10 minutes from now
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.status(200).json({ 
    success: true, 
    message: 'Password reset instructions sent',
    resetToken 
  });
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Validate password strength
  if (password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters long');
  }

  // Hash the token to compare with stored token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password (will be hashed by pre-save middleware)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ 
    success: true, 
    message: 'Password reset successful',
    token: generateToken(user._id)
  });
});

export { 
  requestPasswordReset, 
  resetPassword 
};