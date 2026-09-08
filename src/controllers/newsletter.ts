import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { newsletter } from "../models/newsletter.js";
import { user as users } from "../models/user.js";
import { volunteer as volunteers } from "../models/volunteer.js";
import { createError } from "../middlewares/errorHandler.js";
import { eq } from "drizzle-orm";
import { sendBulkEmails } from "../services/emailService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

// ---------------------------------------------------------------------------
// Subscribe
// ---------------------------------------------------------------------------
export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const [subscription] = await db
      .insert(newsletter)
      .values({ email })
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

// ---------------------------------------------------------------------------
// Unsubscribe
// ---------------------------------------------------------------------------
export const unsubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    await db
      .update(newsletter)
      .set({ isActive: false, unsubscribedAt: new Date() })
      .where(eq(newsletter.email, email));

    res.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    next(createError("Failed to unsubscribe", 500));
  }
};

// ---------------------------------------------------------------------------
// Get subscribers
// ---------------------------------------------------------------------------
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
      data: { subscribers },
    });
  } catch (error) {
    next(createError("Failed to fetch subscribers", 500));
  }
};

// ---------------------------------------------------------------------------
// Delete subscriber
// ---------------------------------------------------------------------------
export const deleteSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await db.delete(newsletter).where(eq(newsletter.id, id));

    res.json({ success: true, message: "Subscriber deleted" });
  } catch (error) {
    next(createError("Failed to delete subscriber", 500));
  }
};

// ---------------------------------------------------------------------------
// Get recipient count (for the UI estimate)
// ---------------------------------------------------------------------------
export const getRecipientCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { group } = req.query as { group: string };
    let count = 0;

    if (group === "all_subscribers") {
      const rows = await db
        .select({ id: newsletter.id })
        .from(newsletter)
        .where(eq(newsletter.isActive, true));
      count = rows.length;
    } else if (group === "all_users") {
      const rows = await db.select({ id: users.id }).from(users);
      count = rows.length;
    } else if (group === "all_volunteers") {
      const rows = await db.select({ id: volunteers.id }).from(volunteers);
      count = rows.length;
    } else {
      return next(createError("Invalid recipient group", 400));
    }

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('[getRecipientCount] Error:', error);
    next(createError("Failed to get recipient count", 500));
  }
};

// ---------------------------------------------------------------------------
// Send bulk email
// ---------------------------------------------------------------------------
export const sendBulkEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subject, body, recipientGroup, customEmails } = req.body;

    if (!subject || !body) {
      return next(createError("Subject and body are required", 400));
    }

    let emailList: string[] = [];

    if (recipientGroup === "all_subscribers") {
      const rows = await db
        .select({ email: newsletter.email })
        .from(newsletter)
        .where(eq(newsletter.isActive, true));
      emailList = rows.map((r) => r.email);
    } else if (recipientGroup === "all_users") {
      const rows = await db.select({ email: users.email }).from(users);
      emailList = rows.map((r) => r.email);
    } else if (recipientGroup === "all_volunteers") {
      const rows = await db.select({ email: volunteers.email }).from(volunteers);
      emailList = rows.map((r) => r.email);
    } else if (recipientGroup === "custom" && Array.isArray(customEmails)) {
      emailList = customEmails.filter((e: string) => typeof e === "string" && e.includes("@"));
    } else {
      return next(createError("Invalid recipient group", 400));
    }

    if (emailList.length === 0) {
      return res.json({
        success: true,
        message: "No recipients found for this group",
        data: { total: 0, sent: 0, failed: 0, failedAddresses: [] },
      });
    }

    const result = await sendBulkEmails({
      to: emailList,
      subject,
      htmlBody: body,
    });

    res.json({
      success: true,
      message: `Bulk email sent. ${result.sent}/${result.total} delivered.`,
      data: result,
    });
  } catch (error: any) {
    if (error.message?.includes("Email not configured")) {
      return next(createError(error.message, 503));
    }
    next(createError("Failed to send bulk email", 500));
  }
};
