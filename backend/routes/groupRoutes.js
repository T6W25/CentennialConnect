import express from "express"
import {
  getGroupById,
  updateGroup,
  deleteGroup,
  createGroupPost,
  pinGroupPost,
  joinGroup,
} from "../controllers/groupController.js"
import { protect, communityManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router
  .route("/:id")
  .get(protect, getGroupById)
  .put(protect, communityManager, updateGroup)
  .delete(protect, communityManager, deleteGroup)

router.route("/:id/posts").post(protect, createGroupPost)
router.route("/:id/posts/:postId/pin").put(protect, communityManager, pinGroupPost)
router.route("/:id/join").put(protect, joinGroup)

export default router

