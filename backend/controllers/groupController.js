import asyncHandler from "express-async-handler"
import Group from "../models/groupModel.js"
import Post from "../models/postModel.js"

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate("creator", "name email profilePicture")
    .populate("managers", "name email profilePicture")
    .populate("members", "name email profilePicture")
    .populate("community", "name description image")
    .populate({
      path: "posts",
      populate: {
        path: "author",
        select: "name email profilePicture",
      },
    })
    .populate({
      path: "pinnedPosts",
      populate: {
        path: "author",
        select: "name email profilePicture",
      },
    })

  if (group) {
    res.json(group)
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private/CommunityManager
const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a manager of the group
    if (!group.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized as a manager of this group")
    }

    group.name = req.body.name || group.name
    group.description = req.body.description || group.description
    group.image = req.body.image || group.image

    const updatedGroup = await group.save()
    res.json(updatedGroup)
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private/CommunityManager
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is the creator of the group or an admin
    if (group.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized to delete this group")
    }

    // Delete all posts in the group
    await Post.deleteMany({ group: group._id })

    await group.remove()
    res.json({ message: "Group removed" })
  } else {
    res.status(404)
    throw new Error("Group not found");
  }
})

// @desc    Create a post in a group
// @route   POST /api/groups/:id/posts
// @access  Private
const createGroupPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a member of the group
    if (!group.members.includes(req.user._id)) {
      res.status(401)
      throw new Error("You must be a member of this group to post")
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      group: group._id,
    })

    group.posts.push(post._id)
    await group.save()

    res.status(201).json(post)
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Pin a post in a group
// @route   PUT /api/groups/:id/posts/:postId/pin
// @access  Private/CommunityManager
const pinGroupPost = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
  const post = await Post.findById(req.params.postId)

  if (group && post) {
    // Check if user is a manager of the group
    if (!group.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized as a manager of this group")
    }

    // Check if post belongs to the group
    if (post.group.toString() !== group._id.toString()) {
      res.status(400)
      throw new Error("Post does not belong to this group")
    }

    // Toggle pin status
    if (group.pinnedPosts.includes(post._id)) {
      group.pinnedPosts = group.pinnedPosts.filter((p) => p.toString() !== post._id.toString())
      post.isPinned = false
    } else {
      group.pinnedPosts.push(post._id)
      post.isPinned = true
    }

    await group.save()
    await post.save()

    res.json({ message: "Post pin status updated" })
  } else {
    res.status(404)
    throw new Error("Group or post not found")
  }
})

// @desc    Join a group
// @route   PUT /api/groups/:id/join
// @access  Private
const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is already a member
    if (group.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are already a member of this group")
    }

    group.members.push(req.user._id)
    await group.save()

    res.json({ message: "Joined group successfully" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

export { getGroupById, updateGroup, deleteGroup, createGroupPost, pinGroupPost, joinGroup }

