import { Router } from "express";
import { subscribe, unsubscribe, getSubscribers } from "../controllers/newsletter.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/subscribers", authenticate, authorize("admin"), getSubscribers);

export default router;