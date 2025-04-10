// In userController.js
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// @desc    Request password reset
// @route   POST /api/users/reset-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body
  
  // Find user by email
  const user = await User.findOne({ email })
  
  if (user) {
    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // 30 minutes
    
    await user.save()
    
    // Create reset URL with token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    
    // Create email message
    const message = `
      You are receiving this email because you (or someone else) has requested to reset your password.
      Please click on the following link to reset your password:
      
      ${resetUrl}
      
      This link is valid for 30 minutes only.
      
      If you did not request this, please ignore this email and your password will remain unchanged.
    `
    
    try {
      // Setup email transporter (configure based on your email provider)
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
      
      // Send email
      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      })
      
      res.status(200).json({ success: true, message: 'Password reset email sent' })
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()
      
      res.status(500)
      throw new Error('Email could not be sent')
    }
  } else {
    // Don't reveal that the user doesn't exist
    // Still return success to prevent user enumeration attacks
    res.status(200).json({ success: true, message: 'If the email exists, a password reset link will be sent' })
  }
})

// @desc    Reset password with token
// @route   POST /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  
  if (!user) {
    res.status(400)
    throw new Error('Invalid or expired token')
  }
  
  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  
  await user.save()
  
  // Return JWT token so user can be logged in
  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  })
})

// Export the new functions along with your existing ones
export { requestPasswordReset, resetPassword }