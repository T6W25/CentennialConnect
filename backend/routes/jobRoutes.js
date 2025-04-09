import express from "express"
import {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
  applyForJob,
  updateApplicationStatus,
} from "../controllers/jobController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createJob).get(protect, getJobs)

router.route("/:id").get(protect, getJobById).delete(protect, deleteJob)

router.route("/:id/status").put(protect, updateJobStatus)
router.route("/:id/apply").post(protect, applyForJob)
router.route("/:id/applications/:applicationId").put(protect, updateApplicationStatus)

export default router

