import { Router, Request, Response, NextFunction } from "express";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post(
  "/image",
  authenticate,
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided" });
      }

      const result = await uploadImage(req.file.buffer);

      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: { imageUrl: result.url, publicId: result.public_id },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
