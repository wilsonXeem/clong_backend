import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { resource } from "../models/resource.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq, desc, and } from "drizzle-orm";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/cloudinaryService.js";
import { validateResourceFile } from "../middlewares/fileValidation.js";

export const createResource = [
  upload.single("file"),
  validateResourceFile,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, category, isPublic } = req.body;
      const uploadedBy = (req as AuthRequest).user?.id;

      if (!uploadedBy) {
        return next(createError("User not authenticated", 401));
      }

      if (!req.file) {
        return next(createError("File is required", 400));
      }

      const result = await uploadImage(req.file.buffer, "resources");

      const [newResource] = await db
        .insert(resource)
        .values({
          title,
          description,
          fileUrl: result.url,
          fileType: req.file.mimetype,
          category,
          isPublic: isPublic !== undefined ? isPublic : true,
          uploadedBy,
        })
        .returning();

      res.status(201).json({
        success: true,
        message: "Resource created successfully",
        data: { resource: newResource },
      });
    } catch (error) {
      next(error);
    }
  },
];

export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.query;

    let query = db.select().from(resource);

    const conditions = [eq(resource.isPublic, true)];

    if (category) {
      conditions.push(eq(resource.category, category as string));
    }

    const resourceList = await query
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(resource.createdAt));

    res.json({
      success: true,
      data: { resources: resourceList },
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [foundResource] = await db
      .select()
      .from(resource)
      .where(eq(resource.id, id));

    if (!foundResource) {
      return next(createError("Resource not found", 404));
    }

    res.json({
      success: true,
      data: { resource: foundResource },
    });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, category, isPublic } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return next(createError("User not authenticated", 401));
    }

    // Check if user owns the resource or is admin
    const [existingResource] = await db
      .select()
      .from(resource)
      .where(eq(resource.id, id));

    if (!existingResource) {
      return next(createError("Resource not found", 404));
    }

    if (existingResource.uploadedBy !== userId) {
      return next(createError("Unauthorized to update this resource", 403));
    }

    const [updatedResource] = await db
      .update(resource)
      .set({
        title,
        description,
        category,
        isPublic,
      })
      .where(eq(resource.id, id))
      .returning();

    res.json({
      success: true,
      message: "Resource updated successfully",
      data: { resource: updatedResource },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return next(createError("User not authenticated", 401));
    }

    // Check if user owns the resource or is admin
    const [existingResource] = await db
      .select()
      .from(resource)
      .where(eq(resource.id, id));

    if (!existingResource) {
      return next(createError("Resource not found", 404));
    }

    if (existingResource.uploadedBy !== userId) {
      return next(createError("Unauthorized to delete this resource", 403));
    }

    await db.delete(resource).where(eq(resource.id, id));

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createError("User not authenticated", 401));
    }

    const userResources = await db
      .select()
      .from(resource)
      .where(eq(resource.uploadedBy, userId))
      .orderBy(desc(resource.createdAt));

    res.json({
      success: true,
      data: { resources: userResources },
    });
  } catch (error) {
    next(error);
  }
};
