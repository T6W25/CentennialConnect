const Event = require('../models/Event');
const User = require('../models/User');

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



//joining function
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
};
