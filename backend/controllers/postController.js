import asyncHandler from "express-async-handler"
import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import { createNotification } from "./notificationController.js"

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, community, group } = req.body

  if (!title || !content) {
    res.status(400)
    throw new Error("Please provide title and content")
  }

  const post = new Post({
    title,
    content,
    author: req.user._id,
    category: category || "General",
    tags: tags || [],
    community: community || null,
    group: group || null
  })

  const createdPost = await post.save()

  // Add post to user's posts
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { posts: createdPost._id }
  })

  // Notify community members if posted in a community
  if (community) {
    // This would depend on your community model implementation
    // Placeholder for notification logic
  }

  res.status(201).json(createdPost)
})

// @desc    Get all posts with filtering options
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.page) || 1

  // Build filter object based on query parameters
  const filter = {}
  
  if (req.query.category) {
    filter.category = req.query.category
  }
  
  if (req.query.tag) {
    filter.tags = req.query.tag
  }
  
  if (req.query.community) {
    filter.community = req.query.community
  }
  
  if (req.query.group) {
    filter.group = req.query.group
  }
  
  if (req.query.author) {
    filter.author = req.query.author
  }
  
  if (req.query.search) {
    filter.$text = { $search: req.query.search }
  }

  // Sort options
  let sort = {}
  
  switch (req.query.sort) {
    case "newest":
      sort = { createdAt: -1 }
      break
    case "oldest":
      sort = { createdAt: 1 }
      break
    case "mostUpvotes":
      sort = { upvoteCount: -1 }
      break
    case "mostComments":
      sort = { "comments.length": -1 }
      break
    default:
      sort = { createdAt: -1 } // Default to newest
  }

  const count = await Post.countDocuments(filter)
  const posts = await Post.find(filter)
    .populate("author", "name email profilePicture")
    .populate("community", "name description image")
    .populate("group", "name description image")
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    posts,
    page,
    pages: Math.ceil(count / pageSize),
    totalCount: count
  })
})

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
    // Increment view count
    post.views = (post.views || 0) + 1
    await post.save()
    
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
    post.category = req.body.category || post.category
    post.tags = req.body.tags || post.tags

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

    await post.deleteOne() // Using deleteOne instead of remove which is deprecated
    
    // Remove post from user's posts array
    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id }
    })
    
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
    const alreadyUpvoted = post.upvotes.includes(req.user._id)

    if (alreadyUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter((upvote) => upvote.toString() !== req.user._id.toString())
      post.upvoteCount = Math.max(0, (post.upvoteCount || 0) - 1)
    } else {
      // Add upvote
      post.upvotes.push(req.user._id)
      post.upvoteCount = (post.upvoteCount || 0) + 1

      // Create notification for the post author (if not themselves)
      if (post.author.toString() !== req.user._id.toString()) {
        await createNotification(
          post.author,
          req.user._id,
          "postUpvote",
          `${req.user.name} upvoted your post "${post.title.substring(0, 30)}${post.title.length > 30 ? "..." : ""}"`,
          post._id
        )
      }
    }

    await post.save()
    res.json({ 
      upvotes: post.upvotes,
      upvoteCount: post.upvoteCount
    })
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
  
  if (!text) {
    res.status(400)
    throw new Error("Comment text is required")
  }
  
  const post = await Post.findById(req.params.id)

  if (post) {
    const comment = {
      user: req.user._id,
      text,
      upvotes: []
    }

    post.comments.push(comment)
    post.commentCount = (post.commentCount || 0) + 1
    
    await post.save()

    // Create notification for the post author (if not themselves)
    if (post.author.toString() !== req.user._id.toString()) {
      await createNotification(
        post.author,
        req.user._id,
        "postComment",
        `${req.user.name} commented on your post "${post.title.substring(0, 30)}${post.title.length > 30 ? "..." : ""}"`,
        post._id
      )
    }

    const updatedPost = await Post.findById(req.params.id).populate("comments.user", "name email profilePicture")
    res.status(201).json(updatedPost.comments)
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Upvote a comment
// @route   PUT /api/posts/:id/comments/:commentId/upvote
// @access  Private
const upvoteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(404)
    throw new Error("Post not found")
  }

  // Find the comment
  const comment = post.comments.id(req.params.commentId)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  // Initialize upvotes array if it doesn't exist
  if (!comment.upvotes) {
    comment.upvotes = []
  }

  // Check if user has already upvoted
  const alreadyUpvoted = comment.upvotes.includes(req.user._id)

  if (alreadyUpvoted) {
    // Remove upvote
    comment.upvotes = comment.upvotes.filter(
      (upvote) => upvote.toString() !== req.user._id.toString()
    )
    comment.upvoteCount = Math.max(0, (comment.upvoteCount || 0) - 1)
  } else {
    // Add upvote
    comment.upvotes.push(req.user._id)
    comment.upvoteCount = (comment.upvoteCount || 0) + 1

    // Create notification for the comment author (if not themselves)
    if (comment.user.toString() !== req.user._id.toString()) {
      await createNotification(
        comment.user,
        req.user._id,
        "commentUpvote",
        `${req.user.name} upvoted your comment`,
        post._id
      )
    }
  }

  await post.save()

  res.json({
    upvotes: comment.upvotes,
    upvoteCount: comment.upvoteCount
  })
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

export { 
  createPost,
  getPosts,
  getPostById, 
  updatePost, 
  deletePost, 
  upvotePost, 
  commentOnPost, 
  upvoteComment,
  getFeaturedPosts 
}