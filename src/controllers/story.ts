import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { story } from "../models/story.js";
import { user } from "../models/user.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq, desc } from "drizzle-orm";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/cloudinaryService.js";

export const createStory = [
  upload.single("image"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, content, isPublished } = req.body;
      const authorId = req.user?.id;

      if (!authorId) {
        return next(createError("User not authenticated", 401));
      }

      let imageUrl = null;
      if (req.file) {
        const result = await uploadImage(req.file.buffer, "stories");
        imageUrl = result.url;
      }

      const [newStory] = await db
        .insert(story)
        .values({
          title,
          content,
          imageUrl,
          authorId,
          isPublished: isPublished === 'true' || isPublished === true,
        })
        .returning();

      res.status(201).json({
        success: true,
        message: "Story created successfully",
        data: { story: newStory },
      });
    } catch (error) {
      next(error);
    }
  },
];

export const getStories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const storyList = await db
      .select({
        id: story.id,
        title: story.title,
        content: story.content,
        imageUrl: story.imageUrl,
        isPublished: story.isPublished,
        createdAt: story.createdAt,
        authorName: user.firstName,
      })
      .from(story)
      .leftJoin(user, eq(story.authorId, user.id))
      .where(eq(story.isPublished, true))
      .orderBy(desc(story.createdAt));

    res.json({
      success: true,
      data: { stories: storyList },
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [foundStory] = await db.select().from(story).where(eq(story.id, id));

    if (!foundStory) {
      return next(createError("Story not found", 404));
    }

    res.json({
      success: true,
      data: { story: foundStory },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStory = [
  upload.single("image"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, content, imageUrl, isPublished } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return next(createError("User not authenticated", 401));
      }

      const [existingStory] = await db
        .select()
        .from(story)
        .where(eq(story.id, id));

      if (!existingStory) {
        return next(createError("Story not found", 404));
      }

      if (existingStory.authorId !== userId) {
        return next(createError("Unauthorized to update this story", 403));
      }

      let finalImageUrl = imageUrl || existingStory.imageUrl;
      
      // If a new image file is uploaded, upload it and use the new URL
      if (req.file) {
        const result = await uploadImage(req.file.buffer, "stories");
        finalImageUrl = result.url;
      }

      const [updatedStory] = await db
        .update(story)
        .set({
          title,
          content,
          imageUrl: finalImageUrl,
          isPublished: isPublished === 'true' || isPublished === true,
          updatedAt: new Date(),
        })
        .where(eq(story.id, id))
        .returning();

      res.json({
        success: true,
        message: "Story updated successfully",
        data: { story: updatedStory },
      });
    } catch (error) {
      next(error);
    }
  },
];

export const deleteStory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("User not authenticated", 401));
    }

    const [existingStory] = await db
      .select()
      .from(story)
      .where(eq(story.id, id));

    if (!existingStory) {
      return next(createError("Story not found", 404));
    }

    if (existingStory.authorId !== userId) {
      return next(createError("Unauthorized to delete this story", 403));
    }

    await db.delete(story).where(eq(story.id, id));

    res.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("User not authenticated", 401));
    }

    const userStories = await db
      .select()
      .from(story)
      .where(eq(story.authorId, userId))
      .orderBy(desc(story.createdAt));

    res.json({
      success: true,
      data: { stories: userStories },
    });
  } catch (error) {
    next(error);
  }
};
