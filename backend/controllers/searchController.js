import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import Community from "../models/communityModel.js"
import Group from "../models/groupModel.js"
import Event from "../models/eventModel.js"
import Post from "../models/postModel.js"
import Job from "../models/jobModel.js"

// @desc    Search users, communities, groups, events, and posts
// @route   GET /api/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const { query, type } = req.query
  const searchQuery = { $regex: query, $options: "i" }

  const results = {}

  if (!type || type === "users") {
    const users = await User.find({
      $or: [{ name: searchQuery }, { email: searchQuery }],
    }).select("name email profilePicture role")
    results.users = users
  }

  if (!type || type === "communities") {
    const communities = await Community.find({
      $or: [{ name: searchQuery }, { description: searchQuery }],
    }).select("name description image")
    results.communities = communities
  }

  if (!type || type === "groups") {
    const groups = await Group.find({
      $or: [{ name: searchQuery }, { description: searchQuery }],
    }).select("name description image community")
    results.groups = groups
  }

  if (!type || type === "events") {
    const events = await Event.find({
      $or: [{ title: searchQuery }, { description: searchQuery }, { location: searchQuery }, { category: searchQuery }],
    }).select("title description date location category image")
    results.events = events
  }

  if (!type || type === "posts") {
    const posts = await Post.find({
      $or: [{ title: searchQuery }, { content: searchQuery }],
    }).select("title content author community group createdAt")
    results.posts = posts
  }

  // Search jobs
  if (!type || type === "jobs") {
    const jobs = await Job.find({
      $or: [{ title: searchRegex }, { company: searchRegex }, { location: searchRegex }, { description: searchRegex }],
    }).populate("employer", "name email profilePicture")

    results.jobs = jobs
  }

  res.json(results)
})

export { search }

