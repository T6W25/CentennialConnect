import request from 'supertest';
import app from '../server.js'; // Import your Express app
import mongoose from 'mongoose';
import User from '../models/userModel'; // Assuming the User model is here
import Event from '../models/eventModel'; // Assuming the Event model is here

jest.mock('../models/userModel'); // Mocking user model
jest.mock('../models/eventModel'); // Mocking event model

let token; // Store token for authentication

// Create a mock user and event
beforeAll(async () => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(), // Add 'new' here
        email: 'test@example.com',
        role: 'user',
        password: 'password123',
      });
      // Mock the generateAuthToken method in your test file
user.generateAuthToken = jest.fn().mockReturnValue('mocked-token');

  await user.save();
  //token = user.generateAuthToken(); // Assuming your User model has this method

  const event = new Event({
    _id: mongoose.Types.ObjectId(),
    title: 'Test Event',
    description: 'This is a test event',
    date: new Date(Date.now() + 1000000), // Set future date
    location: 'Test Location',
    maxAttendees: 10,
    attendees: [],
    creator: user._id,
  });
  

  await event.save();
});



//Test case for successful registration
describe('PUT /api/events/:id/register', () => {
    it('should allow a user to register for an event', async () => {
      const eventId = 'some-event-id'; // Replace with actual event ID from the above mock
  
      const res = await request(app)
        .put(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.status).toBe(200); // Expect status 200 for successful registration
      expect(res.body.message).toBe('Registered for event successfully');
    });
  });

  //Test case for already registered user
  it('should prevent a user from registering for an event they are already registered for', async () => {
    const eventId = 'some-event-id'; // Replace with actual event ID
  
    // Register the user first
    await request(app)
      .put(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${token}`);
  
    // Try registering again
    const res = await request(app)
      .put(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.status).toBe(400); // Expect status 400 for already registered
    expect(res.body.message).toBe('You are already registered for this event');
  });

  //test case for event full
  it('should prevent a user from registering for an event that is at full capacity', async () => {
    const eventId = 'some-event-id'; // Replace with actual event ID
  
    // Mock the event to have max attendees reached
    Event.findById = jest.fn().mockResolvedValueOnce({
      maxAttendees: 1,
      attendees: ['user-id'],
      save: jest.fn(),
    });
  
    const res = await request(app)
      .put(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.status).toBe(400); // Expect status 400 for full capacity
    expect(res.body.message).toBe('Event is at full capacity');
  });

  
  //test case for past event
  it('should prevent a user from registering for a past event', async () => {
    const eventId = 'some-event-id'; // Replace with actual event ID
  
    // Mock the event to have a past date
    Event.findById = jest.fn().mockResolvedValueOnce({
      date: new Date(Date.now() - 1000000), // Set past date
      save: jest.fn(),
    });
  
    const res = await request(app)
      .put(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${token}`);
  
    expect(res.status).toBe(400); // Expect status 400 for past event
    expect(res.body.message).toBe('Cannot register for past events');
  });

  
  //test cleanup
  // Cleanup after all tests
afterAll(async () => {
    await mongoose.connection.close();
  });
  