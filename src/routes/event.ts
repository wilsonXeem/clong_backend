import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
} from "../controllers/event.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - eventDate
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Community Cleanup Day"
 *               description:
 *                 type: string
 *                 example: "Join us for a community cleanup event"
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T10:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Central Park"
 *               maxAttendees:
 *                 type: integer
 *                 example: 50
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: "Event image file"
 *     responses:
 *       201:
 *         description: Event created successfully
 */
router.post("/", authenticate, createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Filter upcoming events only
 *         example: true
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *         example: "Central Park"
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 */
router.get("/", getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 */
router.get("/:id", getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Event Title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-26T10:00:00Z"
 *               location:
 *                 type: string
 *                 example: "New Location"
 *               maxAttendees:
 *                 type: integer
 *                 example: 75
 *     responses:
 *       200:
 *         description: Event updated successfully
 */
router.put("/:id", authenticate, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
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
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete("/:id", authenticate, deleteEvent);

/**
 * @swagger
 * /events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
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
 *         description: Successfully registered for event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/:id/register", authenticate, registerForEvent);

/**
 * @swagger
 * /events/{id}/registrations:
 *   get:
 *     summary: Get event registrations
 *     tags: [Events]
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
 *         description: List of event registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     registrations:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/:id/registrations", authenticate, getEventRegistrations);

export default router;
