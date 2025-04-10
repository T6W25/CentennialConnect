import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    actionTaken: {
      type: String,
      default: 'None',
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Violation = mongoose.model('Violation', violationSchema);

export default Violation;
