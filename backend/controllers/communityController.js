import asyncHandler from "express-async-handler"
import Community from "../models/communityModel.js"
import Group from "../models/groupModel.js"
import Post from "../models/postModel.js"

// @desc    Create a community
// @route   POST /api/communities
// @access  Private/CommunityManager
const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body

  const community = await Community.create({
    name,
    description,
    creator: req.user._id,
    managers: [req.user._id],
    members: [req.user._id],
    image,
  })

  if (community) {
    res.status(201).json(community)
  } else {
    res.status(400)
    throw new Error("Invalid community data")
  }
})

// @desc    Get all communities
// @route   GET /api/communities
// @access  Private
const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({})
  res.json(communities)
})

// @desc    Get community by ID
// @route   GET /api/communities/:id
// @access  Private
const getCommunityById = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)
    .populate("creator", "name email profilePicture")
    .populate("managers", "name email profilePicture")
    .populate("members", "name email profilePicture")
    .populate("groups", "name description image")
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

  if (community) {
    res.json(community)
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Update community
// @route   PUT /api/communities/:id
// @access  Private/CommunityManager
const updateCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of the community
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized as a manager of this community")
    }

    community.name = req.body.name || community.name
    community.description = req.body.description || community.description
    community.image = req.body.image || community.image

    const updatedCommunity = await community.save()
    res.json(updatedCommunity)
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Delete community
// @route   DELETE /api/communities/:id
// @access  Private/CommunityManager
const deleteCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is the creator of the community or an admin
    if (community.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized to delete this community")
    }

    // Delete all groups in the community
    await Group.deleteMany({ community: community._id })

    // Delete all posts in the community
    await Post.deleteMany({ community: community._id })

    await community.remove()
    res.json({ message: "Community removed" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Create a post in a community
// @route   POST /api/communities/:id/posts
// @access  Private
const createCommunityPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a member of the community
    if (!community.members.includes(req.user._id)) {
      res.status(401)
      throw new Error("You must be a member of this community to post")
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      community: community._id,
    })

    community.posts.push(post._id)
    await community.save()

    res.status(201).json(post)
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Pin a post in a community
// @route   PUT /api/communities/:id/posts/:postId/pin
// @access  Private/CommunityManager
const pinCommunityPost = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)
  const post = await Post.findById(req.params.postId)

  if (community && post) {
    // Check if user is a manager of the community
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized as a manager of this community")
    }

    // Check if post belongs to the community
    if (post.community.toString() !== community._id.toString()) {
      res.status(400)
      throw new Error("Post does not belong to this community")
    }

    // Toggle pin status
    if (community.pinnedPosts.includes(post._id)) {
      community.pinnedPosts = community.pinnedPosts.filter((p) => p.toString() !== post._id.toString())
      post.isPinned = false
    } else {
      community.pinnedPosts.push(post._id)
      post.isPinned = true
    }

    await community.save()
    await post.save()

    res.json({ message: "Post pin status updated" })
  } else {
    res.status(404)
    throw new Error("Community or post not found")
  }
})

// @desc    Create a group in a community
// @route   POST /api/communities/:id/groups
// @access  Private/CommunityManager
const createCommunityGroup = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of the community
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized as a manager of this community")
    }

    const group = await Group.create({
      name,
      description,
      community: community._id,
      creator: req.user._id,
      managers: [req.user._id],
      members: [req.user._id],
      image,
    })

    community.groups.push(group._id)
    await community.save()

    res.status(201).json(group)
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

export {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  createCommunityPost,
  pinCommunityPost,
  createCommunityGroup,
}

