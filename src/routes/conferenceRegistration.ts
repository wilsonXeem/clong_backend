import { Router } from "express";
import {
  registerForConference,
  getConferenceRegistrations,
  getConferenceRegistrationCount,
} from "../controllers/conferenceRegistration.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

// Public — register for a conference by slug
router.post("/:slug/register", registerForConference);

// Public — get registration count (for display on the event page)
router.get("/:slug/count", getConferenceRegistrationCount);

// Admin only — get all registrations
router.get(
  "/:slug/registrations",
  authenticate,
  authorize("admin"),
  getConferenceRegistrations,
);

export default router;
