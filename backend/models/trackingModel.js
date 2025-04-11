import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  page: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'visit', 'click'
  details: { type: String }, // optional
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;
