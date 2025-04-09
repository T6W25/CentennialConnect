import express from "express"
import { authUser, registerUser, getUserProfile, updateUserProfile } from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(registerUser)
router.post("/login", authUser)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)
router.route("/connections").get(protect, getUserConnections)
router.route("/notifications").get(protect, getUserNotifications)
router.route("/notifications/:id").put(protect, markNotificationAsRead)
router.route("/resume").post(protect, uploadResume)
router.route("/:id").get(protect, getUserById)

export default router

