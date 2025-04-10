import express from "express"
import {
  getUserById,
  updateUserProfile,
  getUserConnections,
  connectWithUser,
  disconnectFromUser,
  getUserNotifications,
  markNotificationAsRead,
  uploadResume,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js"
import { authUser, registerUser, getUserProfile } from "../controllers/authController.js"
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
router.route("/:id/connect").put(protect, connectWithUser)
router.route("/:id/disconnect").put(protect, disconnectFromUser)

// Password reset routes
router.route("/reset-password").post(requestPasswordReset)
router.route("/reset-password/:token").post(resetPassword)

export default router