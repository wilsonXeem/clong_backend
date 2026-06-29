import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
  getRecipientCount,
  sendBulkEmail,
} from "../controllers/newsletter.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

// Public
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin-only
router.get("/subscribers", authenticate, authorize("admin"), getSubscribers);
router.delete("/subscribers/:id", authenticate, authorize("admin"), deleteSubscriber);
router.get("/recipient-count", authenticate, authorize("admin"), getRecipientCount);
router.post("/send-bulk", authenticate, authorize("admin"), sendBulkEmail);

export default router;