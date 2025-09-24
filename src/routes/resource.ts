import { Router } from "express";
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  getUserResources,
} from "../controllers/resource.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
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
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Resource"
 *               description:
 *                 type: string
 *                 example: "A helpful resource for learning"
 *               category:
 *                 type: string
 *                 example: "education"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resource created successfully
 */
router.post("/", authenticate, createResource);

/**
 * @swagger
 * /resources:
 *   get:
 *     summary: Get all resources
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: "education"
 *     responses:
 *       200:
 *         description: List of resources
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
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/", getResources);

/**
 * @swagger
 * /resources/user:
 *   get:
 *     summary: Get user's resources
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's resources
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
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/user", authenticate, getUserResources);

/**
 * @swagger
 * /resources/{id}:
 *   get:
 *     summary: Get resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Resource details
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
 *                     resource:
 *                       type: object
 */
router.get("/:id", getResourceById);

/**
 * @swagger
 * /resources/{id}:
 *   put:
 *     summary: Update a resource
 *     tags: [Resources]
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
 *                 example: "Updated Resource Title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               category:
 *                 type: string
 *                 example: "technology"
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Resource updated successfully
 */
router.put("/:id", authenticate, updateResource);

/**
 * @swagger
 * /resources/{id}:
 *   delete:
 *     summary: Delete a resource
 *     tags: [Resources]
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
 *         description: Resource deleted successfully
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
router.delete("/:id", authenticate, deleteResource);

export default router;
