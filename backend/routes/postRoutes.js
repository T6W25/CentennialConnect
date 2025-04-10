import express from "express"
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  upvotePost,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/postController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createPost).get(protect, getPosts)

router.route("/:id").get(protect, getPostById).put(protect, updatePost).delete(protect, deletePost)

router.route("/:id/upvote").put(protect, upvotePost)
router.route("/:id/comments").post(protect, addComment)
router.route("/:id/comments/:commentId").put(protect, updateComment).delete(protect, deleteComment)

export default router

