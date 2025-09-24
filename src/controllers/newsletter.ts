import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { newsletter } from "../models/newsletter.js";
import { createError } from "../middlewares/errorHandler.js";
import { eq } from "drizzle-orm";

export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const [subscription] = await db
      .insert(newsletter)
      .values({
        email,
      })
      .returning()
      .catch(() => {
        throw createError("Email already subscribed", 400);
      });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: subscription,
    });
  } catch (error: any) {
    if (error.message === "Email already subscribed") {
      return next(error);
    }
    next(createError("Failed to subscribe", 500));
  }
};

export const unsubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    await db
      .update(newsletter)
      .set({
        isActive: false,
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletter.email, email));

    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    next(createError("Failed to unsubscribe", 500));
  }
};

export const getSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscribers = await db
      .select()
      .from(newsletter)
      .where(eq(newsletter.isActive, true));

    res.json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    next(createError("Failed to fetch subscribers", 500));
  }
};
