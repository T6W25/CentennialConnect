import mongoose from "mongoose"

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Community",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    pinnedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

const Group = mongoose.model("Group", groupSchema)

export default Group

