import { Router } from "express";
import { createDonation, getDonations, getDonationById, updateDonationStatus } from "../controllers/donation.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Create a new donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               programId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: "Program to donate to (optional)"
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 example: 100.50
 *               donorName:
 *                 type: string
 *                 maxLength: 255
 *                 example: "John Doe"
 *               donorEmail:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 example: "john@example.com"
 *               isAnonymous:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               paymentReference:
 *                 type: string
 *                 maxLength: 255
 *                 example: "PAY_123456789"
 *     responses:
 *       201:
 *         description: Donation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 */
router.post("/", authenticate, createDonation);

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Get all donations
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by donation type
 *         example: "general"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *         example: "completed"
 *     responses:
 *       200:
 *         description: List of donations
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
 *                     donations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Donation'
 */
router.get("/", getDonations);

/**
 * @swagger
 * /donations/{id}:
 *   get:
 *     summary: Get donation by ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Donation details
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
 *                     donation:
 *                       $ref: '#/components/schemas/Donation'
 */
router.get("/:id", getDonationById);

/**
 * @swagger
 * /donations/{id}/status:
 *   patch:
 *     summary: Update donation status
 *     tags: [Donations]
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
 *                 enum: ["pending", "completed", "failed"]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Donation status updated
 */
router.patch("/:id/status", updateDonationStatus);

export default router;