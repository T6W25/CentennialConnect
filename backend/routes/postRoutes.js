import express from "express"
import {
  getPostById,
  updatePost,
  deletePost,
  upvotePost,
  commentOnPost,
  getFeaturedPosts,
} from "../controllers/postController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/featured").get(protect, getFeaturedPosts)

router.route("/:id").get(protect, getPostById).put(protect, updatePost).delete(protect, deletePost)

router.route("/:id/upvote").put(protect, upvotePost)
router.route("/:id/comments").post(protect, commentOnPost)

export default router

