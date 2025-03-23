import express from "express"
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  createCommunityPost,
  pinCommunityPost,
  createCommunityGroup,
} from "../controllers/communityController.js"
import { protect, communityManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, communityManager, createCommunity).get(protect, getCommunities)

router.route("/:id").get(protect, getCommunityById).put(protect, updateCommunity).delete(protect, deleteCommunity)

router.route("/:id/posts").post(protect, createCommunityPost)
router.route("/:id/posts/:postId/pin").put(protect, communityManager, pinCommunityPost)
router.route("/:id/groups").post(protect, communityManager, createCommunityGroup)

export default router

