import mongoose from "mongoose"

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      required: true,
      enum: [
        "newFollower",
        "postLike",
        "postComment",
        "commentReply",
        "eventInvite",
        "groupInvite", 
        "communityInvite",
        "messageReceived",
        "postMention",
        "commentMention",
        "communityJoinRequest",
        "communityAccepted",
        "eventReminder",
        "adminAlert",
        "system"
      ]
    },
    content: {
      type: String,
      required: true
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedItemModel"
    },
    relatedItemModel: {
      type: String,
      enum: ["Post", "Comment", "User", "Community", "Event", "Group", "Message"]
    },
    read: {
      type: Boolean,
      default: false
    },
    seen: {
      type: Boolean,
      default: false
    },
    isSystemNotification: {
      type: Boolean,
      default: false
    },
    isBroadcast: {
      type: Boolean,
      default: false
    },
    link: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1 })
notificationSchema.index({ recipient: 1, createdAt: -1 })

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification