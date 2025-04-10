import asyncHandler from "express-async-handler"
import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import Community from "../models/communityModel.js"
import Group from "../models/groupModel.js"

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, community, group, image, isAnnouncement } = req.body

  // Validate community or group
  if (community) {
    const communityExists = await Community.findById(community)
    if (!communityExists) {
      res.status(404)
      throw new Error("Community not found")
    }

    // Check if user is a member of the community
    if (!communityExists.members.includes(req.user._id)) {
      res.status(403)
      throw new Error("You must be a member of the community to post")
    }

    // Check if it's an announcement and if user is authorized
    if (isAnnouncement && !communityExists.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Only community managers can create announcements")
    }
  }

  if (group) {
    const groupExists = await Group.findById(group)
    if (!groupExists) {
      res.status(404)
      throw new Error("Group not found")
    }

    // Check if user is a member of the group
    if (!groupExists.members.includes(req.user._id)) {
      res.status(403)
      throw new Error("You must be a member of the group to post")
    }

    // Check if it's an announcement and if user is authorized
    if (isAnnouncement && !groupExists.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Only group managers can create announcements")
    }
  }

  const post = await Post.create({
    title,
    content,
    author: req.user._id,
    community,
    group,
    image: image || "",
    isAnnouncement: isAnnouncement || false,
  })

  const populatedPost = await Post.findById(post._id)
    .populate("author", "name email profilePicture")
    .populate("community", "name")
    .populate("group", "name")

  res.status(201).json(populatedPost)
})

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const { community, group, author, isAnnouncement } = req.query

  const filter = {}
  if (community) filter.community = community
  if (group) filter.group = group
  if (author) filter.author = author
  if (isAnnouncement) filter.isAnnouncement = isAnnouncement === "true"

  const posts = await Post.find(filter)
    .populate("author", "name email profilePicture")
    .populate("community", "name")
    .populate("group", "name")
    .sort({ createdAt: -1, isPinned: -1 })

  res.json(posts)
})

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email profilePicture")
    .populate("community", "name description")
    .populate("group", "name description")
    .populate("comments.author", "name email profilePicture")
    .populate("upvotes", "name")

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
    // Check if user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      // Check if user is a community manager if it's a community post
      let isAuthorized = false
      if (post.community) {
        const community = await Community.findById(post.community)
        if (community && community.managers.includes(req.user._id)) {
          isAuthorized = true
        }
      }

      // Check if user is a group manager if it's a group post
      if (post.group && !isAuthorized) {
        const group = await Group.findById(post.group)
        if (group && group.managers.includes(req.user._id)) {
          isAuthorized = true
        }
      }

      if (!isAuthorized) {
        res.status(403)
        throw new Error("Not authorized to update this post")
      }
    }

    post.title = req.body.title || post.title
    post.content = req.body.content || post.content
    post.image = req.body.image || post.image
    post.isAnnouncement = req.body.isAnnouncement !== undefined ? req.body.isAnnouncement : post.isAnnouncement
    post.isPinned = req.body.isPinned !== undefined ? req.body.isPinned : post.isPinned

    const updatedPost = await post.save()

    const populatedPost = await Post.findById(updatedPost._id)
      .populate("author", "name email profilePicture")
      .populate("community", "name")
      .populate("group", "name")
      .populate("comments.author", "name email profilePicture")
      .populate("upvotes", "name")

    res.json(populatedPost)
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
    // Check if user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      // Check if user is a community manager if it's a community post
      let isAuthorized = false
      if (post.community) {
        const community = await Community.findById(post.community)
        if (community && community.managers.includes(req.user._id)) {
          isAuthorized = true
        }
      }

      // Check if user is a group manager if it's a group post
      if (post.group && !isAuthorized) {
        const group = await Group.findById(post.group)
        if (group && group.managers.includes(req.user._id)) {
          isAuthorized = true
        }
      }

      if (!isAuthorized) {
        res.status(403)
        throw new Error("Not authorized to delete this post")
      }
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
      // Remove upvote (toggle)
      post.upvotes = post.upvotes.filter((upvoteId) => upvoteId.toString() !== req.user._id.toString())
    } else {
      // Add upvote
      post.upvotes.push(req.user._id)

      // Notify the author if it's not their own post
      if (post.author.toString() !== req.user._id.toString()) {
        const author = await User.findById(post.author)
        author.notifications.push({
          message: `${req.user.name} upvoted your post: ${post.title.substring(0, 30)}${post.title.length > 30 ? "..." : ""}`,
          link: `/posts/${post._id}`,
        })
        await author.save()
      }
    }

    await post.save()

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name email profilePicture")
      .populate("community", "name")
      .populate("group", "name")
      .populate("upvotes", "name")

    res.json(populatedPost)
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  const post = await Post.findById(req.params.id)

  if (post) {
    const comment = {
      content,
      author: req.user._id,
    }

    post.comments.push(comment)
    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate("author", "name email profilePicture")
      .populate("comments.author", "name email profilePicture")

    // Notify the post author if it's not their own comment
    if (post.author.toString() !== req.user._id.toString()) {
      const author = await User.findById(post.author)
      author.notifications.push({
        message: `${req.user.name} commented on your post: ${post.title.substring(0, 30)}${post.title.length > 30 ? "..." : ""}`,
        link: `/posts/${post._id}`,
      })
      await author.save()
    }

    res.status(201).json(updatedPost.comments[updatedPost.comments.length - 1])
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Update comment
// @route   PUT /api/posts/:id/comments/:commentId
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  const post = await Post.findById(req.params.id)

  if (post) {
    const comment = post.comments.id(req.params.commentId)

    if (comment) {
      // Check if user is the comment author or an admin
      if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403)
        throw new Error("Not authorized to update this comment")
      }

      comment.content = content
      await post.save()

      const updatedPost = await Post.findById(post._id).populate("comments.author", "name email profilePicture")

      const updatedComment = updatedPost.comments.id(req.params.commentId)
      res.json(updatedComment)
    } else {
      res.status(404)
      throw new Error("Comment not found")
    }
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    const comment = post.comments.id(req.params.commentId)

    if (comment) {
      // Check if user is the comment author, post author, or an admin
      if (
        comment.author.toString() !== req.user._id.toString() &&
        post.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        // Check if user is a community manager if it's a community post
        let isAuthorized = false
        if (post.community) {
          const community = await Community.findById(post.community)
          if (community && community.managers.includes(req.user._id)) {
            isAuthorized = true
          }
        }

        // Check if user is a group manager if it's a group post
        if (post.group && !isAuthorized) {
          const group = await Group.findById(post.group)
          if (group && group.managers.includes(req.user._id)) {
            isAuthorized = true
          }
        }

        if (!isAuthorized) {
          res.status(403)
          throw new Error("Not authorized to delete this comment")
        }
      }

      post.comments.pull({ _id: req.params.commentId })
      await post.save()

      res.json({ message: "Comment removed" })
    } else {
      res.status(404)
      throw new Error("Comment not found")
    }
  } else {
    res.status(404)
    throw new Error("Post not found")
  }
})

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  upvotePost,
  addComment,
  updateComment,
  deleteComment,
}

