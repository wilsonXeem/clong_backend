import { Router } from "express";
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../controllers/program.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Youth Education Program"
 *               description:
 *                 type: string
 *                 example: "Educational program for underprivileged youth"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/program.jpg"
 *               targetAmount:
 *                 type: number
 *                 example: 50000.00
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Program created successfully
 */
router.post("/", authenticate, createProgram);

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *         example: true
 *     responses:
 *       200:
 *         description: List of programs
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
 *                     programs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Program'
 */
router.get("/", getPrograms);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Program details
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
 *                     program:
 *                       $ref: '#/components/schemas/Program'
 */
router.get("/:id", getProgramById);

/**
 * @swagger
 * /programs/{id}:
 *   put:
 *     summary: Update a program
 *     tags: [Programs]
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
 *                 example: "Updated Program Title"
 *               description:
 *                 type: string
 *                 example: "Updated program description"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/updated-program.jpg"
 *               targetAmount:
 *                 type: number
 *                 example: 75000.00
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-02-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-11-30T23:59:59Z"
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Program updated successfully
 */
router.put("/:id", authenticate, updateProgram);

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
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
 *         description: Program deleted successfully
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
router.delete("/:id", authenticate, deleteProgram);

export default router;
