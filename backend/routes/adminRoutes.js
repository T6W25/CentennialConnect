import express from "express"
import { getUsers, deleteUser, getUserById, updateUser } from "../controllers/adminController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/users").get(protect, admin, getUsers)
router
  .route("/users/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router

