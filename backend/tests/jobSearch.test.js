import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';  // Adjust path to your app instance
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

describe('GET /api/jobs', () => {
  let user;
  let job1, job2;

  beforeAll(async () => {
    // Create a valid user with the correct email format
    await User.create({
      name: 'Test User',
      email: 'testuser@centennialcollege.ca',  // Make sure it's a valid Centennial College email
      password: 'password123',
      role: 'user',
    });

    // Create job entries
    job1 = await Job.create({
      title: 'Software Developer',
      company: 'Company A',
      location: 'Toronto',
      description: 'A great job for a developer.',
      requirements: 'Experience in JS',
      type: 'Full-time',
      salary: '100000',
      contactEmail: 'hr@companya.com',
      postedBy: user._id,
      deadline: new Date(),
    });

    job2 = await Job.create({
      title: 'Frontend Developer',
      company: 'Company B',
      location: 'Vancouver',
      description: 'Join our team!',
      requirements: 'Experience in React',
      type: 'Part-time',
      salary: '60000',
      contactEmail: 'hr@companyb.com',
      postedBy: user._id,
      deadline: new Date(),
    });
  });

  afterAll(async () => {
    await Job.deleteMany({});
    await User.deleteMany({});
    mongoose.connection.close();
  });

  it('should fetch all jobs with no filters', async () => {
    const res = await request(app)
      .get('/api/jobs')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);  // Make sure generateAuthToken is mocked
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);  // Should return both job1 and job2
  });

  it('should filter jobs by type', async () => {
    const res = await request(app)
      .get('/api/jobs?type=Full-time')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);  // Should return only job1 (Full-time)
    expect(res.body[0].title).toBe('Software Developer');
  });

  it('should filter jobs by location', async () => {
    const res = await request(app)
      .get('/api/jobs?location=Toronto')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);  // Should return job1 (Toronto)
    expect(res.body[0].title).toBe('Software Developer');
  });

  it('should return 404 if no jobs match the filter', async () => {
    const res = await request(app)
      .get('/api/jobs?type=Internship')
      .set('Authorization', `Bearer ${user.generateAuthToken()}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);  // No jobs should match this filter
  });
});
