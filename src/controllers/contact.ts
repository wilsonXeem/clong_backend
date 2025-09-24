import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { contact } from "../models/contact.js";
import { createError } from "../middlewares/errorHandler.js";
import { eq } from "drizzle-orm";

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, subject, message } = req.body;

    const [newContact] = await db
      .insert(contact)
      .values({
        name,
        email,
        subject,
        message,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    next(createError("Failed to submit contact form", 500));
  }
};

export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allContacts = await db
      .select()
      .from(contact)
      .orderBy(contact.createdAt);

    res.json({
      success: true,
      data: allContacts,
    });
  } catch (error) {
    next(createError("Failed to fetch contacts", 500));
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await db.update(contact).set({ isRead: true }).where(eq(contact.id, id));

    res.json({
      success: true,
      message: "Contact marked as read",
    });
  } catch (error) {
    next(createError("Failed to update contact", 500));
  }
};
