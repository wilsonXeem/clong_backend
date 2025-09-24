import { Router } from "express";
import { 
  applyVolunteer, 
  getVolunteers, 
  getVolunteerById, 
  updateVolunteerStatus,
  getUserVolunteerApplication 
} from "../controllers/volunteer.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /volunteers/apply:
 *   post:
 *     summary: Apply to become a volunteer
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *               - availability
 *               - interests
 *             properties:
 *               skills:
 *                 type: string
 *                 example: "Teaching, Event Management, Social Media"
 *               availability:
 *                 type: string
 *                 example: "Weekends, Evenings"
 *               interests:
 *                 type: string
 *                 example: "Youth mentorship, Educational programs"
 *               experience:
 *                 type: string
 *                 example: "Previous volunteer experience with NGOs"
 *               motivation:
 *                 type: string
 *                 example: "Passionate about raising Godly leaders"
 *     responses:
 *       201:
 *         description: Volunteer application submitted successfully
 */
router.post("/apply", authenticate, applyVolunteer);

/**
 * @swagger
 * /volunteers:
 *   get:
 *     summary: Get all volunteers (Admin only)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, active]
 *         description: Filter by volunteer status
 *     responses:
 *       200:
 *         description: List of volunteers
 */
router.get("/", authenticate, getVolunteers);

/**
 * @swagger
 * /volunteers/my-application:
 *   get:
 *     summary: Get current user's volunteer application
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's volunteer application
 *       404:
 *         description: No application found
 */
router.get("/my-application", authenticate, getUserVolunteerApplication);

/**
 * @swagger
 * /volunteers/{id}:
 *   get:
 *     summary: Get volunteer by ID (Admin only)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Volunteer details
 */
router.get("/:id", authenticate, getVolunteerById);

/**
 * @swagger
 * /volunteers/{id}/status:
 *   put:
 *     summary: Update volunteer status (Admin only)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, active]
 *                 example: "approved"
 *     responses:
 *       200:
 *         description: Volunteer status updated successfully
 */
router.put("/:id/status", authenticate, updateVolunteerStatus);

export default router;