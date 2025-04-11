import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  response: {
    type: String,
    enum: ['Yes', 'No', 'Maybe'],
    default: 'Yes',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RSVP = mongoose.model('RSVP', rsvpSchema);
export default RSVP;
