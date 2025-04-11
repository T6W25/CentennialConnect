// __tests__/jobApplication.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; 
import User from '../models/userModel.js';
import Job from '../models/jobModel.js';
import JobApplication from '../models/jobApplicationModel.js';
import { generateToken } from '../utils/authUtils'; // Adjust based on your implementation for generating tokens

let token;
let userId;
let jobId;

beforeAll(async () => {
  // Set up test user
  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123', // Add a hashed password handling if needed
  });

  userId = user._id;

  // Generate a token for authentication
  token = generateToken(userId);

  // Set up a job
  const job = await Job.create({
    title: 'Software Engineer',
    company: 'Test Company',
    location: 'Remote',
    description: 'Test job description',
    requirements: 'Test job requirements',
    type: 'Full-time',
    contactEmail: 'contact@example.com',
    postedBy: userId,
    deadline: new Date(),
  });

  jobId = job._id;
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany();
  await Job.deleteMany();
  await JobApplication.deleteMany();
  mongoose.connection.close();
});

describe('POST /api/jobs/:id/apply', () => {
  it('should apply for a job successfully', async () => {
    const response = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am very excited to apply for this position.',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.resume).toBe('https://example.com/resume.pdf');
    expect(response.body.coverLetter).toBe('I am very excited to apply for this position.');
  });

  it('should return error if the job is already closed', async () => {
    await Job.findByIdAndUpdate(jobId, { status: 'Closed' });

    const response = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am very excited to apply for this position.',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('This job is no longer accepting applications');
  });

  it('should return error if the user has already applied', async () => {
    await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am very excited to apply for this position.',
      });

    const response = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am very excited to apply for this position.',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You have already applied for this job');
  });

  it('should return error if resume is missing', async () => {
    const response = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        coverLetter: 'I am very excited to apply for this position.',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Resume is required');
  });
});

describe('GET /api/applications/myapplications', () => {
  it('should return all applications submitted by the current user', async () => {
    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      resume: 'https://example.com/resume.pdf',
      coverLetter: 'I am very excited to apply for this position.',
    });

    const response = await request(app)
      .get('/api/applications/myapplications')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].job._id).toBe(jobId.toString());
  });
});

describe('GET /api/applications/:id', () => {
  it('should return the application by ID', async () => {
    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      resume: 'https://example.com/resume.pdf',
      coverLetter: 'I am very excited to apply for this position.',
    });

    const response = await request(app)
      .get(`/api/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.resume).toBe('https://example.com/resume.pdf');
  });

  it('should return error if application not found', async () => {
    const response = await request(app)
      .get('/api/applications/invalidapplicationid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Application not found');
  });
});

describe('PUT /api/applications/:id', () => {
  it('should update the status of the application', async () => {
    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      resume: 'https://example.com/resume.pdf',
      coverLetter: 'I am very excited to apply for this position.',
    });

    const response = await request(app)
      .put(`/api/applications/${application._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'Reviewed',
        notes: 'Shortlisted for interview',
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Reviewed');
    expect(response.body.notes).toBe('Shortlisted for interview');
  });

  it('should return error if not authorized', async () => {
    const anotherUser = await User.create({
      name: 'Another User',
      email: 'anotheruser@example.com',
      password: 'password123',
    });

    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      resume: 'https://example.com/resume.pdf',
      coverLetter: 'I am very excited to apply for this position.',
    });

    const response = await request(app)
      .put(`/api/applications/${application._id}`)
      .set('Authorization', `Bearer ${generateToken(anotherUser._id)}`)
      .send({
        status: 'Reviewed',
        notes: 'Shortlisted for interview',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Not authorized to update this application');
  });
});
