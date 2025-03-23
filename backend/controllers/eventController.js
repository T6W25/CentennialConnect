// controllers/eventController.js
import asyncHandler from "express-async-handler"
import Event from "../models/eventModel.js"
import User from "../models/userModel.js"
import { createNotification } from "./notificationController.js"

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Check if user is already registered
  const isRegistered = event.attendees.includes(req.user._id)
  const existingDetailedRegistration = event.attendeeDetails?.find(
    (a) => a.user.toString() === req.user._id.toString()
  )

  if (isRegistered || existingDetailedRegistration) {
    res.status(400)
    throw new Error("You're already registered for this event")
  }

  // Check if event is full
  const isFull = event.maxAttendees > 0 && event.attendeeCount >= event.maxAttendees
  const status = isFull && event.allowWaitlist ? 'waitlisted' : 'registered'

  if (isFull && !event.allowWaitlist) {
    res.status(400)
    throw new Error("This event is full and doesn't allow waitlisting")
  }

  // Process registration responses if provided
  const registrationResponses = new Map()
  
  if (req.body.responses && event.registrationQuestions && event.registrationQuestions.length > 0) {
    // Validate required questions are answered
    event.registrationQuestions.forEach((question, index) => {
      if (question.required && !req.body.responses[`question_${index}`]) {
        res.status(400)
        throw new Error(`${question.questionText} is required`)
      }
      
      if (req.body.responses[`question_${index}`]) {
        registrationResponses.set(`question_${index}`, req.body.responses[`question_${index}`])
      }
    })
  }

  // Add attendee to event's basic list
  event.attendees.push(req.user._id)
  
  // Add detailed attendee info
  if (!event.attendeeDetails) {
    event.attendeeDetails = []
  }
  
  event.attendeeDetails.push({
    user: req.user._id,
    status,
    registrationResponses
  })

  // Increment attendee count
  if (!event.attendeeCount) {
    event.attendeeCount = 0
  }
  event.attendeeCount += 1

  await event.save()

  // Add event to user's events list
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { events: event._id }
  })

  // Create notification for event organizer
  if (event.creator.toString() !== req.user._id.toString()) {
    await createNotification(
      event.creator,
      req.user._id,
      'eventRegistration',
      `${req.user.name} has registered for your event "${event.title}"`,
      event._id
    )
  }

  res.status(201).json({
    message: isFull ? "You've been added to the waitlist" : "Successfully registered for the event",
    status
  })
})

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
const cancelRegistration = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Remove from simple attendees array
  const simpleAttendeeIndex = event.attendees.indexOf(req.user._id)
  if (simpleAttendeeIndex !== -1) {
    event.attendees.splice(simpleAttendeeIndex, 1)
  }

  // Find detailed attendee
  const detailedAttendeeIndex = event.attendeeDetails?.findIndex(
    (a) => a.user.toString() === req.user._id.toString()
  )

  if (detailedAttendeeIndex === -1 && simpleAttendeeIndex === -1) {
    res.status(400)
    throw new Error("You are not registered for this event")
  }

  // Remove from detailed attendees or mark as cancelled
  if (detailedAttendeeIndex !== -1) {
    // Option 1: Remove the attendee completely
    // event.attendeeDetails.splice(detailedAttendeeIndex, 1)
    
    // Option 2: Mark as cancelled instead of removing
    event.attendeeDetails[detailedAttendeeIndex].status = 'cancelled'
  }
  
  // Decrement attendee count
  event.attendeeCount = Math.max(0, (event.attendeeCount || 0) - 1)

  // Check if there are waitlisted attendees to promote
  if (event.maxAttendees > 0 && event.attendeeCount < event.maxAttendees && event.attendeeDetails) {
    const waitlistedAttendee = event.attendeeDetails.find(a => a.status === 'waitlisted')
    
    if (waitlistedAttendee) {
      waitlistedAttendee.status = 'registered'
      
      // Notify the promoted attendee
      await createNotification(
        waitlistedAttendee.user,
        event.creator,
        'eventWaitlistPromotion',
        `You've been moved from the waitlist to registered for "${event.title}"`,
        event._id
      )
    }
  }

  await event.save()

  // Remove event from user's events list
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { events: event._id }
  })

  res.json({ message: "Registration cancelled successfully" })
})

// @desc    Get registered attendees for an event
// @route   GET /api/events/:id/attendees
// @access  Private (only organizer or admin)
const getEventAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('attendees', 'name email profilePicture')
    .populate('attendeeDetails.user', 'name email profilePicture')

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Check if user is organizer or admin or event manager
  if (
    event.creator.toString() !== req.user._id.toString() && 
    req.user.role !== 'admin' &&
    req.user.role !== 'eventManager'
  ) {
    res.status(403)
    throw new Error("Not authorized to access attendee list")
  }

  // If we have detailed attendee info, use it
  if (event.attendeeDetails && event.attendeeDetails.length > 0) {
    res.json({
      registered: event.attendeeDetails.filter(a => a.status === 'registered'),
      waitlisted: event.attendeeDetails.filter(a => a.status === 'waitlisted'),
      cancelled: event.attendeeDetails.filter(a => a.status === 'cancelled'),
      attended: event.attendeeDetails.filter(a => a.status === 'attended'),
    })
  } else {
    // Fallback to simpler structure for backward compatibility
    res.json({
      registered: event.attendees.map(a => ({ user: a })),
      waitlisted: [],
      cancelled: [],
      attended: [],
    })
  }
})

// @desc    Check registration status for current user
// @route   GET /api/events/:id/registration
// @access  Private
const getRegistrationStatus = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Check in detailed attendees first
  const detailedAttendee = event.attendeeDetails?.find(
    (a) => a.user.toString() === req.user._id.toString()
  )

  if (detailedAttendee) {
    res.json({
      registered: true,
      status: detailedAttendee.status,
      registeredAt: detailedAttendee.registeredAt,
      responses: detailedAttendee.registrationResponses ? 
        Object.fromEntries(detailedAttendee.registrationResponses) : {}
    })
    return
  }

  // Check in simple attendees list as fallback
  const isRegistered = event.attendees.some(
    (a) => a.toString() === req.user._id.toString()
  )

  if (isRegistered) {
    res.json({
      registered: true,
      status: 'registered',
      registeredAt: event.createdAt // fallback registration date
    })
    return
  }

  res.json({ registered: false })
})

// @desc    Mark attendance for an event
// @route   PUT /api/events/:id/attendance/:userId
// @access  Private (only organizer or admin)
const markAttendance = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Check if user is organizer or admin or event manager
  if (
    event.creator.toString() !== req.user._id.toString() && 
    req.user.role !== 'admin' &&
    req.user.role !== 'eventManager'
  ) {
    res.status(403)
    throw new Error("Not authorized to mark attendance")
  }

  // Try to find in detailed attendees
  const detailedAttendee = event.attendeeDetails?.find(
    (a) => a.user.toString() === req.params.userId
  )

  if (detailedAttendee) {
    // Update status
    detailedAttendee.status = 'attended'
    await event.save()
    res.json({ message: "Attendance marked successfully" })
    return
  }

  // Check in simple attendees
  const isRegistered = event.attendees.some(
    (a) => a.toString() === req.params.userId
  )

  if (isRegistered) {
    // Create detailed entry if it doesn't exist
    if (!event.attendeeDetails) {
      event.attendeeDetails = []
    }
    
    event.attendeeDetails.push({
      user: req.params.userId,
      status: 'attended',
      registeredAt: new Date()
    })
    
    await event.save()
    res.json({ message: "Attendance marked successfully" })
    return
  }

  res.status(400)
  throw new Error("User is not registered for this event")
})

export { 
  // ... your existing controller functions
  registerForEvent,
  cancelRegistration,
  getEventAttendees,
  getRegistrationStatus,
  markAttendance
}