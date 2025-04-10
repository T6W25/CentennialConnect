import mongoose from 'mongoose';

const engagementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  page: { type: String, required: true }, 
  duration: { type: Number, default: 0 }, 
  actions: [{ type: String }], 
  date: { type: Date, default: Date.now }
});

const Engagement = mongoose.model('Engagement', engagementSchema);

export default Engagement;
