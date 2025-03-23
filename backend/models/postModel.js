import mongoose from "mongoose"

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    upvoteCount: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true
  }
)

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    category: {
      type: String,
    },
    tags: [String],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0
    },
    comments: [commentSchema],
    commentCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Add indexes for better query performance
postSchema.index({ title: "text", content: "text" })
postSchema.index({ category: 1 })
postSchema.index({ tags: 1 })
postSchema.index({ author: 1 })
postSchema.index({ community: 1 })
postSchema.index({ group: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ upvoteCount: -1 })

const Post = mongoose.model("Post", postSchema)

export default Post