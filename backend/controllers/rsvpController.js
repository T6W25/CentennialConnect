import asyncHandler from 'express-async-handler';
import RSVP from '../models/rsvpModel.js';

const submitRSVP = asyncHandler(async (req, res) => {
  const { eventId, response } = req.body;

  const existing = await RSVP.findOne({ event: eventId, user: req.user._id });

  if (existing) {
    existing.response = response;
    await existing.save();
    return res.json(existing);
  }

  const rsvp = await RSVP.create({
    event: eventId,
    user: req.user._id,
    response,
  });

  res.status(201).json(rsvp);
});

const getEventRSVPs = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const rsvps = await RSVP.find({ event: eventId }).populate('user', 'name email');

  res.json(rsvps);
});

export { submitRSVP, getEventRSVPs };
