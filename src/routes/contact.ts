import { Router } from "express";
import { createContact, getContacts, markAsRead } from "../controllers/contact.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", createContact);
router.get("/", authenticate, authorize("admin"), getContacts);
router.patch("/:id/read", authenticate, authorize("admin"), markAsRead);

export default router;