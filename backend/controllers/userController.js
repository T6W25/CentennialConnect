const User = require('../models/User');

exports.connectUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.connections.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already connected' });
    }

    user.connections.push(targetUserId);
    targetUser.connections.push(userId);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'Connection successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
