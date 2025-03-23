const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a event
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

// event joining method
exports.joinEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ message: 'Event or user not found' });
    }

    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already joined' });
    }

    event.participants.push(userId);
    user.events.push(eventId);

    await event.save();
    await user.save();

    res.status(200).json({ message: 'Joined event successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}


export {
  createEvent,
  getEvents,
  getFeaturedEvents,
  registerForEvent,
  unregisterFromEvent  
}