import request from 'supertest';  // For making HTTP requests
import app from '../server.js';   // Import the app to make requests to it
import User from '../models/userModel.js';  // Import User model
import nodemailer from 'nodemailer';  // Import nodemailer

// Mocking the nodemailer and User model
jest.mock('nodemailer');
jest.mock('../models/userModel.js');

describe('Password Reset Controller', () => {

  // Test for Requesting a Password Reset
  describe('POST /api/users/reset-password', () => {
    it('should send a password reset email if email exists', async () => {
      // Mocking the User model
      const user = { email: 'testuser@example.com', save: jest.fn() };
      User.findOne = jest.fn().mockResolvedValue(user);
      
      // Mocking nodemailer transporter
      const sendMailMock = jest.fn().mockResolvedValue('Email sent');
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({ email: 'testuser@example.com' });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset email sent');
      expect(sendMailMock).toHaveBeenCalledTimes(1);
    });

    it('should return success message even if email does not exist', async () => {
      // Mocking User.findOne to return null (email doesn't exist)
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({ email: 'nonexistentuser@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('If the email exists, a password reset link will be sent');
    });

    it('should return error if email sending fails', async () => {
      const user = { email: 'testuser@example.com', save: jest.fn() };
      User.findOne = jest.fn().mockResolvedValue(user);

      // Mocking the email sending to throw an error
      const sendMailMock = jest.fn().mockRejectedValue(new Error('Email could not be sent'));
      nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

      const response = await request(app)
        .post('/api/users/reset-password')
        .send({ email: 'testuser@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Email could not be sent');
    });
  });

  // Test for Resetting Password
  describe('POST /api/users/reset-password/:token', () => {
    it('should reset password with a valid token', async () => {
      const user = {
        email: 'testuser@example.com',
        password: 'newPassword',
        resetPasswordToken: 'hashedToken',
        resetPasswordExpire: Date.now() + 60 * 60 * 1000,  // Valid token within expiration time
        save: jest.fn()
      };
      
      User.findOne = jest.fn().mockResolvedValue(user);

      const response = await request(app)
        .post('/api/users/reset-password/hashedToken')
        .send({ password: 'newPassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset successful');
      expect(user.password).toBe('newPassword');  // Ensure the password is updated
    });

   
  });
});
