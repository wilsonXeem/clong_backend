import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { event } from "../models/event.js";
import { eventRegistration } from "../models/eventRegistration.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq, desc, gte, sql } from "drizzle-orm";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/cloudinaryService.js";

export const createEvent = [
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, location, eventDate, maxAttendees } =
        req.body;

      let imageUrl = null;
      if (req.file) {
        const result = await uploadImage(req.file.buffer, "events");
        imageUrl = result.url;
      }

      const [newEvent] = await db
        .insert(event)
        .values({
          title,
          description,
          imageUrl,
          location,
          eventDate: new Date(eventDate),
          maxAttendees,
        })
        .returning();

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: { event: newEvent },
      });
    } catch (error) {
      next(error);
    }
  },
];

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventList = await db
      .select()
      .from(event)
      .where(eq(event.isActive, true))
      .orderBy(desc(event.eventDate));

    res.json({
      success: true,
      data: { events: eventList },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [foundEvent] = await db.select().from(event).where(eq(event.id, id));

    if (!foundEvent) {
      return next(createError("Event not found", 404));
    }

    res.json({
      success: true,
      data: { event: foundEvent },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, location, eventDate, maxAttendees } =
      req.body;

    const [updatedEvent] = await db
      .update(event)
      .set({
        title,
        description,
        imageUrl,
        location,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        maxAttendees,
        updatedAt: new Date(),
      })
      .where(eq(event.id, id))
      .returning();

    if (!updatedEvent) {
      return next(createError("Event not found", 404));
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: { event: updatedEvent },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [deletedEvent] = await db
      .update(event)
      .set({ isActive: false })
      .where(eq(event.id, id))
      .returning();

    if (!deletedEvent) {
      return next(createError("Event not found", 404));
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { attendeeName, attendeeEmail, attendeePhone } = req.body;
    const userId = (req as AuthRequest).user?.id;

    // Check if event exists and has capacity
    const [foundEvent] = await db.select().from(event).where(eq(event.id, id));
    if (!foundEvent) {
      return next(createError("Event not found", 404));
    }

    if (
      foundEvent.maxAttendees &&
      foundEvent.currentAttendees >= foundEvent.maxAttendees
    ) {
      return next(createError("Event is full", 400));
    }

    const [registration] = await db
      .insert(eventRegistration)
      .values({
        eventId: id,
        userId,
        attendeeName,
        attendeeEmail,
        attendeePhone,
      })
      .returning();

    // Update current attendees count
    await db
      .update(event)
      .set({
        currentAttendees: sql`${foundEvent.currentAttendees} + 1`,
      })
      .where(eq(event.id, id));

    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      data: { registration },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const registrations = await db
      .select()
      .from(eventRegistration)
      .where(eq(eventRegistration.eventId, id))
      .orderBy(desc(eventRegistration.registrationDate));

    res.json({
      success: true,
      data: { registrations },
    });
  } catch (error) {
    next(error);
  }
};
