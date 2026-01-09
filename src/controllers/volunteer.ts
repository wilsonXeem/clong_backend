import { Request, Response } from "express";
import { db } from "../config/db.js";
import { volunteer, user } from "../models/index.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq, and } from "drizzle-orm";

export const applyVolunteer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, skills, availability, interests, experience, motivation } = req.body;

    // Check if email already exists in volunteer applications
    const existingApplication = await db
      .select()
      .from(volunteer)
      .where(eq(volunteer.email, email))
      .limit(1);

    if (existingApplication.length > 0) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists",
      });
    }

    const [newVolunteer] = await db
      .insert(volunteer)
      .values({
        firstName,
        lastName,
        email,
        phone,
        skills,
        availability,
        interests,
        experience,
        motivation,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      data: { volunteer: newVolunteer },
    });
  } catch (error) {
    console.error("Error applying for volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit volunteer application",
    });
  }
};

export const getVolunteers = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const baseQuery = db
      .select({
        id: volunteer.id,
        skills: volunteer.skills,
        availability: volunteer.availability,
        interests: volunteer.interests,
        experience: volunteer.experience,
        motivation: volunteer.motivation,
        status: volunteer.status,
        createdAt: volunteer.createdAt,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      })
      .from(volunteer)
      .innerJoin(user, eq(volunteer.userId, user.id));

    const volunteerList = status
      ? await baseQuery.where(eq(volunteer.status, status as string))
      : await baseQuery;

    res.json({
      success: true,
      data: { volunteers: volunteerList },
    });
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteers",
    });
  }
};

export const getVolunteerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [foundVolunteer] = await db
      .select({
        id: volunteer.id,
        skills: volunteer.skills,
        availability: volunteer.availability,
        interests: volunteer.interests,
        experience: volunteer.experience,
        motivation: volunteer.motivation,
        status: volunteer.status,
        createdAt: volunteer.createdAt,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      })
      .from(volunteer)
      .innerJoin(user, eq(volunteer.userId, user.id))
      .where(eq(volunteer.id, id))
      .limit(1);

    if (!foundVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      data: { volunteer: foundVolunteer },
    });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteer",
    });
  }
};

export const updateVolunteerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedVolunteer] = await db
      .update(volunteer)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(volunteer.id, id))
      .returning();

    if (!updatedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.json({
      success: true,
      message: "Volunteer status updated successfully",
      data: { volunteer: updatedVolunteer },
    });
  } catch (error) {
    console.error("Error updating volunteer status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update volunteer status",
    });
  }
};

export const getUserVolunteerApplication = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const [userVolunteer] = await db
      .select()
      .from(volunteer)
      .where(eq(volunteer.userId, userId))
      .limit(1);

    if (!userVolunteer) {
      return res.status(404).json({
        success: false,
        message: "No volunteer application found",
      });
    }

    res.json({
      success: true,
      data: { volunteer: userVolunteer },
    });
  } catch (error) {
    console.error("Error fetching user volunteer application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteer application",
    });
  }
};
