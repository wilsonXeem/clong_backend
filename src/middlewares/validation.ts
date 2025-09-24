import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createError } from "./errorHandler.js";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => err.message).join(", ");
        return next(createError(message, 400));
      }
      next(error);
    }
  };
};