import asyncHandler from "express-async-handler"
import Notification from "../models/notificationModel.js"

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  
  const count = await Notification.countDocuments({ recipient: req.user._id })
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("sender", "name profileImage")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  
  // Update the seen status for retrieved notifications
  if (notifications.length > 0) {
    await Notification.updateMany(
      { 
        recipient: req.user._id, 
        seen: false,
        _id: { $in: notifications.map(n => n._id) }
      },
      { seen: true }
    )
  }
  
  // Count unread notifications for badge counter
  const unreadCount = await Notification.countDocuments({ 
    recipient: req.user._id,
    read: false
  })
  
  res.json({ 
    notifications, 
    page, 
    pages: Math.ceil(count / pageSize),
    unreadCount
  })
})

// @desc    Get count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ 
    recipient: req.user._id,
    read: false
  })
  
  res.json({ count })
})

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)
  
  if (!notification) {
    res.status(404)
    throw new Error("Notification not found")
  }
  
  // Check if user owns this notification
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("User not authorized to update this notification")
  }
  
  notification.read = true
  await notification.save()
  
  res.json({ message: "Notification marked as read" })
})

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  )
  
  res.json({ message: "All notifications marked as read" })
})

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)
  
  if (!notification) {
    res.status(404)
    throw new Error("Notification not found")
  }
  
  // Check if user owns this notification
  if (notification.recipient.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("User not authorized to delete this notification")
  }
  
  await notification.deleteOne()
  res.json({ message: "Notification removed" })
})

// @desc    Create notification (internal use for other controllers)
// @route   None (used by other controllers)
// @access  Private
const createNotification = async (recipientId, senderId, type, content, relatedItem) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      relatedItem,
      relatedItemModel: relatedItem ? "Event" : undefined
    })
    
    await notification.save()
    
    // Here you could implement real-time notifications with Socket.io
    
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

// @desc    Get all notifications (admin only)
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getAllNotifications = asyncHandler(async (req, res) => {
  const pageSize = 20
  const page = Number(req.query.pageNumber) || 1
  
  // Optional filters
  const type = req.query.type ? { type: req.query.type } : {}
  const dateFilter = req.query.date ? { 
    createdAt: { 
      $gte: new Date(req.query.date) 
    } 
  } : {}
  
  const count = await Notification.countDocuments({ ...type, ...dateFilter })
  const notifications = await Notification.find({ ...type, ...dateFilter })
    .populate("recipient", "name email")
    .populate("sender", "name email")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  
  res.json({ 
    notifications, 
    page, 
    pages: Math.ceil(count / pageSize),
    count
  })
})

// @desc    Create a notification (admin use)
// @route   POST /api/admin/notifications
// @access  Private/Admin
const createSystemNotification = asyncHandler(async (req, res) => {
  const { recipientId, type, content, relatedItem } = req.body
  
  // Validate required fields
  if (!recipientId || !type || !content) {
    res.status(400)
    throw new Error("Please provide recipient, type and content")
  }
  
  const notification = new Notification({
    recipient: recipientId,
    sender: req.user._id,
    type,
    content,
    relatedItem,
    isSystemNotification: true
  })
  
  const createdNotification = await notification.save()
  
  res.status(201).json(createdNotification)
})

// @desc    Send notification to all users
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Admin
const broadcastNotification = asyncHandler(async (req, res) => {
  const { type, content, userFilter } = req.body
  
  if (!type || !content) {
    res.status(400)
    throw new Error("Please provide notification type and content")
  }
  
  // Filter users based on criteria if provided
  let userQuery = {}
  if (userFilter && userFilter.role) {
    userQuery.role = userFilter.role
  }
  
  // Get all eligible users
  const User = await import("../models/userModel.js").then(m => m.default)
  const users = await User.find(userQuery).select("_id")
  
  // Create notifications for each user
  const notifications = users.map(user => ({
    recipient: user._id,
    sender: req.user._id,
    type,
    content,
    isSystemNotification: true,
    isBroadcast: true
  }))
  
  await Notification.insertMany(notifications)
  
  res.status(201).json({ 
    message: "Broadcast notification sent successfully",
    recipientCount: users.length
  })
})

export { 
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getAllNotifications,
  createSystemNotification,
  broadcastNotification
}