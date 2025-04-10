import express from "express"
import {
  getPlatformOverview,
  getCommunityAnalytics,
  getEventAnalytics,
  getUserAnalytics,
} from "../controllers/analyticsController.js"
import { protect, admin, communityManager, eventManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/overview").get(protect, admin, getPlatformOverview)
router.route("/communities/:id").get(protect, communityManager, getCommunityAnalytics)
router.route("/events/:id").get(protect, eventManager, getEventAnalytics)
router.route("/users").get(protect, admin, getUserAnalytics)

export default router

