import express from "express"
import {
  createEvent,
  getEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  sendEventAnnouncement,
} from "../controllers/eventController.js"
import { protect, eventManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, eventManager, createEvent).get(protect, getEvents)

router.route("/featured").get(protect, getFeaturedEvents)

router
  .route("/:id")
  .get(protect, getEventById)
  .put(protect, eventManager, updateEvent)
  .delete(protect, eventManager, deleteEvent)

router.route("/:id/register").put(protect, registerForEvent)
router.route("/:id/unregister").put(protect, unregisterFromEvent)
router.route("/:id/announcements").post(protect, eventManager, sendEventAnnouncement)

export default router

