import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import Event from "../models/eventModel.js"


// @desc    Search users, events
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

res.json(results)
})

export { search }

