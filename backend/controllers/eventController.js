const Event = require('../models/Event');
const User = require('../models/User');

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
