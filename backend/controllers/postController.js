import asyncHandler from "express-async-handler"
import Post from "../models/postModel.js"

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email profilePicture")
    .populate("community", "name description image")
    .populate("group", "name description image")
    .populate("upvotes", "name email profilePicture")
    .populate("comments.user", "name email profilePicture")

  if (post) {
    res.json(post)
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    // Check if user is the author of the post or an admin or community manager
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "communityManager"
    ) {
      res.status(401)
      throw new Error("Not authorized to update this post")
    }

    post.title = req.body.title || post.title
    post.content = req.body.content || post.content
    post.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : post.isFeatured

    const updatedPost = await post.save()
    res.json(updatedPost)
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    // Check if user is the author of the post or an admin or community manager
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "communityManager"
    ) {
      res.status(401)
      throw new Error("Not authorized to delete this post")
    }

    await post.remove()
    res.json({ message: "Post removed" })
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Upvote a post
// @route   PUT /api/posts/:id/upvote
// @access  Private
const upvotePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    // Check if user has already upvoted
    if (post.upvotes.includes(req.user._id)) {
      // Remove upvote
      post.upvotes = post.upvotes.filter((upvote) => upvote.toString() !== req.user._id.toString())
    } else {
      // Add upvote
      post.upvotes.push(req.user._id)
    }

    await post.save()
    res.json({ upvotes: post.upvotes })
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Comment on a post
// @route   POST /api/posts/:id/comments
// @access  Private
const commentOnPost = asyncHandler(async (req, res) => {
  const { text } = req.body
  const post = await Post.findById(req.params.id)

  if (post) {
    const comment = {
      user: req.user._id,
      text,
    }

    post.comments.push(comment)
    await post.save()

    const updatedPost = await Post.findById(req.params.id).populate("comments.user", "name email profilePicture")

    res.status(201).json(updatedPost.comments)
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Private
const getFeaturedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ isFeatured: true })
    .populate("author", "name email profilePicture")
    .populate("community", "name description image")
    .populate("group", "name description image")
    .sort({ createdAt: -1 })
    .limit(5)
  res.json(posts)
})

export { getPostById, updatePost, deletePost, upvotePost, commentOnPost, getFeaturedPosts }

