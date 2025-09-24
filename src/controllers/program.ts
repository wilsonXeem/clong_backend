import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { program } from "../models/program.js";
import { createError } from "../middlewares/errorHandler.js";
import { eq, desc } from "drizzle-orm";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/cloudinaryService.js";

export const createProgram = [
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, targetAmount, startDate, endDate } = req.body;

      let imageUrl = null;
      if (req.file) {
        const result = await uploadImage(req.file.buffer, "programs");
        imageUrl = result.url;
      }

      const [newProgram] = await db
        .insert(program)
        .values({
          title,
          description,
          imageUrl,
          targetAmount,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        })
        .returning();

      res.status(201).json({
        success: true,
        message: "Program created successfully",
        data: { program: newProgram },
      });
    } catch (error) {
      next(error);
    }
  },
];

export const getPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const programList = await db
      .select()
      .from(program)
      .where(eq(program.isActive, true))
      .orderBy(desc(program.createdAt));

    res.json({
      success: true,
      data: { programs: programList },
    });
  } catch (error) {
    next(error);
  }
};

export const getProgramById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [foundProgram] = await db
      .select()
      .from(program)
      .where(eq(program.id, id));

    if (!foundProgram) {
      return next(createError("Program not found", 404));
    }

    res.json({
      success: true,
      data: { program: foundProgram },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, targetAmount, startDate, endDate } =
      req.body;

    const [updatedProgram] = await db
      .update(program)
      .set({
        title,
        description,
        imageUrl,
        targetAmount,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(program.id, id))
      .returning();

    if (!updatedProgram) {
      return next(createError("Program not found", 404));
    }

    res.json({
      success: true,
      message: "Program updated successfully",
      data: { program: updatedProgram },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [deletedProgram] = await db
      .update(program)
      .set({ isActive: false })
      .where(eq(program.id, id))
      .returning();

    if (!deletedProgram) {
      return next(createError("Program not found", 404));
    }

    res.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
