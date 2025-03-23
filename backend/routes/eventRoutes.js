// routes/eventRoutes.js
import express from "express"
const router = express.Router()
import {
  // Your existing event controller functions
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  // Event registration functions
  registerForEvent,
  cancelRegistration,
  getEventAttendees,
  getRegistrationStatus,
  markAttendance
} from "../controllers/eventController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

// Base event routes
router.route("/")
  .get(getEvents)
  .post(protect, createEvent)

router.route("/:id")
  .get(getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent)

// Event registration routes
router.route("/:id/register")
  .post(protect, registerForEvent)
  .delete(protect, cancelRegistration)

router.route("/:id/registration")
  .get(protect, getRegistrationStatus)

router.route("/:id/attendees")
  .get(protect, getEventAttendees)

router.route("/:id/attendance/:userId")
  .put(protect, markAttendance)

export default router