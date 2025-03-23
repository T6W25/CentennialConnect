import mongoose from "mongoose"

const attendeeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'waitlisted', 'cancelled', 'attended'],
    default: 'registered'
  },
  registrationResponses: {
    type: Map,
    of: String
  }
})

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attendeeDetails: [attendeeSchema],
    attendeeCount: {
      type: Number,
      default: 0
    },
    maxAttendees: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    image: {
      type: String,
      default: "",
    },
    announcements: [
      {
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    meetingLink: String,
    allowWaitlist: {
      type: Boolean,
      default: true
    },
    registrationQuestions: [{
      questionText: String,
      required: Boolean,
      type: {
        type: String,
        enum: ['text', 'select', 'checkbox'],
        default: 'text'
      },
      options: [String] // For select or checkbox types
    }],
    endDate: {
      type: Date
    }
  },
  {
    timestamps: true,
  },
)

// Add method to check if event is full
eventSchema.methods.isFull = function() {
  return this.maxAttendees > 0 && this.attendeeCount >= this.maxAttendees
}

// Add indexes for better query performance
eventSchema.index({ date: 1 })
eventSchema.index({ category: 1 })
eventSchema.index({ creator: 1 })
eventSchema.index({ "attendeeDetails.user": 1, _id: 1 })

const Event = mongoose.model("Event", eventSchema)

export default Event