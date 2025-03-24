import asyncHandler from "express-async-handler"
import Event from "../models/eventModel.js"
import User from "../models/userModel.js"

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/EventManager
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, category, maxAttendees, image } = req.body

  const event = await Event.create({
    title,
    description,
    date,
    location,
    category,
    creator: req.user._id,
    maxAttendees: maxAttendees || 0,
    image,
  })

  if (event) {
    res.status(201).json(event)
  } else {
    res.status(400)
    throw new Error("Invalid event data")
  }
})

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).populate("creator", "name email profilePicture").sort({ date: 1 })
  res.json(events)
})

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Private
const getFeaturedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ isFeatured: true })
    .populate("creator", "name email profilePicture")
    .sort({ date: 1 })
    .limit(5)
  res.json(events)
})

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("creator", "name email profilePicture")
    .populate("attendees", "name email profilePicture")

  if (event) {
    res.json(event)
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/EventManager
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of the event or an admin
    if (
      event.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "eventManager"
    ) {
      res.status(401)
      throw new Error("Not authorized to update this event")
    }

    event.title = req.body.title || event.title
    event.description = req.body.description || event.description
    event.date = req.body.date || event.date
    event.location = req.body.location || event.location
    event.category = req.body.category || event.category
    event.maxAttendees = req.body.maxAttendees || event.maxAttendees
    event.image = req.body.image || event.image
    event.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : event.isFeatured

    const updatedEvent = await event.save()
    res.json(updatedEvent)
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/EventManager
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of the event or an admin
    if (
      event.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "eventManager"
    ) {
      res.status(401)
      throw new Error("Not authorized to delete this event")
    }

    await event.remove()
    res.json({ message: "Event removed" })
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Register for an event
// @route   PUT /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  const user = await User.findById(req.user._id)

  if (event && user) {
    // Check if event has reached max attendees
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      res.status(400)
      throw new Error("Event has reached maximum capacity")
    }

    // Check if user is already registered
    if (event.attendees.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are already registered for this event")
    }

    event.attendees.push(req.user._id)
    await event.save()

    user.events.push(event._id)
    await user.save()

    res.json({ message: "Registered for event successfully" })
  } else {
    res.status(404)
    throw new Error("Event or user not found")
  }
})

// @desc    Unregister from an event
// @route   PUT /api/events/:id/unregister
// @access  Private
const unregisterFromEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  const user = await User.findById(req.user._id)

  if (event && user) {
    // Check if user is registered
    if (!event.attendees.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are not registered for this event")
    }

    event.attendees = event.attendees.filter((attendee) => attendee.toString() !== req.user._id.toString())
    await event.save()

    user.events = user.events.filter((userEvent) => userEvent.toString() !== event._id.toString())
    await user.save()

    res.json({ message: "Unregistered from event successfully" })
  } else {
    res.status(404)
    throw new Error("Event or user not found")
  }
})

// @desc    Send event announcement
// @route   POST /api/events/:id/announcements
// @access  Private/EventManager
const sendEventAnnouncement = asyncHandler(async (req, res) => {
  const { message } = req.body
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of the event or an admin or event manager
    if (
      event.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "eventManager"
    ) {
      res.status(401)
      throw new Error("Not authorized to send announcements for this event")
    }

    event.announcements.push({ message })
    await event.save()

    // Notify all attendees
    for (const attendeeId of event.attendees) {
      const attendee = await User.findById(attendeeId)
      if (attendee) {
        attendee.notifications.push({
          message: `New announcement for ${event.title}: ${message}`,
          link: `/events/${event._id}`,
        })
        await attendee.save()
      }
    }

    res.status(201).json({ message: "Announcement sent successfully" })
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

export {
  createEvent,
  getEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  sendEventAnnouncement,
}

