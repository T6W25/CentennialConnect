// models/jobModel.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    },
    salary: {
      type: String,
      default: 'Not specified',
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    skills: [String],
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search functionality
jobSchema.index(
  {
    title: 'text',
    company: 'text',
    description: 'text',
    location: 'text',
    skills: 'text',
  },
  {
    weights: {
      title: 10,
      skills: 5,
      company: 3,
      location: 2,
      description: 1,
    },
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;