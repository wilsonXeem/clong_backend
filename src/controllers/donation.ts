import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { donation } from "../models/donation.js";
import { program } from "../models/program.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq, desc, sql } from "drizzle-orm";

export const createDonation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { programId, amount, donorName, donorEmail, isAnonymous } = req.body;
    const userId = (req as AuthRequest).user?.id;

    const [newDonation] = await db
      .insert(donation)
      .values({
        userId,
        programId,
        amount,
        donorName,
        donorEmail,
        isAnonymous: isAnonymous || false,
        paymentStatus: "pending",
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: { donation: newDonation },
    });
  } catch (error) {
    next(error);
  }
};

export const getDonations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const donationList = await db
      .select({
        id: donation.id,
        amount: donation.amount,
        donorName: donation.donorName,
        isAnonymous: donation.isAnonymous,
        paymentStatus: donation.paymentStatus,
        createdAt: donation.createdAt,
        programTitle: program.title,
      })
      .from(donation)
      .leftJoin(program, eq(donation.programId, program.id))
      .orderBy(desc(donation.createdAt));

    res.json({
      success: true,
      data: { donations: donationList },
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const [foundDonation] = await db
      .select()
      .from(donation)
      .where(eq(donation.id, id));

    if (!foundDonation) {
      return next(createError("Donation not found", 404));
    }

    res.json({
      success: true,
      data: { donation: foundDonation },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentReference } = req.body;

    const [updatedDonation] = await db
      .update(donation)
      .set({ paymentStatus, paymentReference })
      .where(eq(donation.id, id))
      .returning();

    if (!updatedDonation) {
      return next(createError("Donation not found", 404));
    }

    // Update program current amount if payment is successful
    if (paymentStatus === "completed") {
      await db
        .update(program)
        .set({
          currentAmount: sql`${program.currentAmount} + ${updatedDonation.amount}`,
        })
        .where(eq(program.id, updatedDonation.programId!));
    }

    res.json({
      success: true,
      message: "Donation status updated successfully",
      data: { donation: updatedDonation },
    });
  } catch (error) {
    next(error);
  }
};
