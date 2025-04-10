import asyncHandler from "express-async-handler"
import Event from "../models/eventModel.js"
import Community from "../models/communityModel.js"
import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import Job from "../models/jobModel.js"

// @desc    Get platform overview analytics
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getPlatformOverview = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments()
  const eventCount = await Event.countDocuments()
  const communityCount = await Community.countDocuments()
  const postCount = await Post.countDocuments()
  const jobCount = await Job.countDocuments()

  // Get user growth over time (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  // Get active users in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activeUserCount = await User.countDocuments({
    updatedAt: { $gte: thirtyDaysAgo },
  })

  res.json({
    userCount,
    eventCount,
    communityCount,
    postCount,
    jobCount,
    userGrowth,
    activeUserCount,
    activeUserPercentage: Math.round((activeUserCount / userCount) * 100),
  })
})

// @desc    Get community analytics
// @route   GET /api/analytics/communities/:id
// @access  Private/CommunityManager
const getCommunityAnalytics = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (!community) {
    res.status(404)
    throw new Error("Community not found")
  }

  // Check if user is a manager of the community or an admin
  if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
    res.status(401)
    throw new Error("Not authorized to view these analytics")
  }

  // Member growth over time (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Get post activity
  const posts = await Post.find({ community: community._id }).sort({ createdAt: -1 }).limit(100)

  const postActivity = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

    if (!acc[monthYear]) {
      acc[monthYear] = 0
    }

    acc[monthYear]++
    return acc
  }, {})

  // Get most active members
  const postsByAuthor = posts.reduce((acc, post) => {
    const authorId = post.author.toString()

    if (!acc[authorId]) {
      acc[authorId] = 0
    }

    acc[authorId]++
    return acc
  }, {})

  const topMemberIds = Object.keys(postsByAuthor)
    .sort((a, b) => postsByAuthor[b] - postsByAuthor[a])
    .slice(0, 5)

  const topMembers = await User.find({ _id: { $in: topMemberIds } }).select("name email profilePicture")

  const formattedTopMembers = topMembers.map((member) => ({
    _id: member._id,
    name: member.name,
    email: member.email,
    profilePicture: member.profilePicture,
    postCount: postsByAuthor[member._id.toString()],
  }))

  res.json({
    memberCount: community.members.length,
    postCount: posts.length,
    groupCount: community.groups.length,
    postActivity,
    topMembers: formattedTopMembers,
  })
})

// @desc    Get event analytics
// @route   GET /api/analytics/events/:id
// @access  Private/EventManager
const getEventAnalytics = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("attendees", "name email profilePicture")

  if (!event) {
    res.status(404)
    throw new Error("Event not found")
  }

  // Check if user is the creator of the event or an admin
  if (
    event.creator.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "eventManager"
  ) {
    res.status(401)
    throw new Error("Not authorized to view these analytics")
  }

  // Calculate registration rate
  const registrationRate =
    event.maxAttendees > 0 ? Math.round((event.attendees.length / event.maxAttendees) * 100) : 100

  // Get registration timeline
  const registrationTimeline = event.attendees.reduce((acc, attendee) => {
    // Note: This would require storing registration date in the event model
    // For now, we'll use a placeholder
    const date = new Date() // placeholder
    const dayMonth = `${date.getDate()}/${date.getMonth() + 1}`

    if (!acc[dayMonth]) {
      acc[dayMonth] = 0
    }

    acc[dayMonth]++
    return acc
  }, {})

  res.json({
    attendeeCount: event.attendees.length,
    maxAttendees: event.maxAttendees,
    registrationRate,
    registrationTimeline,
    announcementCount: event.announcements.length,
    daysUntilEvent: Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)),
  })
})

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()

  // Get user roles distribution
  const userRoles = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ])

  // Get new users per month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const newUsersPerMonth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  // Get active users in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: thirtyDaysAgo },
  })

  res.json({
    totalUsers,
    userRoles,
    newUsersPerMonth,
    activeUsers,
    activeUserPercentage: Math.round((activeUsers / totalUsers) * 100),
  })
})

export { getPlatformOverview, getCommunityAnalytics, getEventAnalytics, getUserAnalytics }

