import { Router } from "express";
import { createStory, getStories, getStoryById, updateStory, deleteStory, getUserStories } from "../controllers/story.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
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
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Journey with the Organization"
 *               content:
 *                 type: string
 *                 example: "This is my story about how the organization helped me..."
 *               category:
 *                 type: string
 *                 example: "success-story"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/story-image.jpg"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Story created successfully
 */
router.post("/", authenticate, createStory);

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: "success-story"
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured stories only
 *         example: true
 *     responses:
 *       200:
 *         description: List of stories
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
 *                     stories:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/", getStories);

/**
 * @swagger
 * /stories/user:
 *   get:
 *     summary: Get user's stories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's stories
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
 *                     stories:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/user", authenticate, getUserStories);

/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Get story by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Story details
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
 *                     story:
 *                       type: object
 */
router.get("/:id", getStoryById);

/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     summary: Update a story
 *     tags: [Stories]
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
 *                 example: "Updated Story Title"
 *               content:
 *                 type: string
 *                 example: "Updated story content..."
 *               category:
 *                 type: string
 *                 example: "testimonial"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Story updated successfully
 */
router.put("/:id", authenticate, updateStory);

/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     summary: Delete a story
 *     tags: [Stories]
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
 *         description: Story deleted successfully
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
router.delete("/:id", authenticate, deleteStory);

export default router;