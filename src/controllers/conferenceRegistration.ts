import { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { conferenceRegistration } from "../models/conferenceRegistration.js";
import { createError } from "../middlewares/errorHandler.js";
import { eq, desc } from "drizzle-orm";
import { AuthRequest } from "../middlewares/authMiddleware.js";

// ---------------------------------------------------------------------------
// Register for a specific conference
// ---------------------------------------------------------------------------
export const registerForConference = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;
    const {
      fullName,
      ageGroup,
      gender,
      countryOfResidence,
      stateCity,
      phoneWhatsapp,
      email,
      currentStatus,
      institution,
      departmentFieldExpertise,
      highestDegree,
      yearOfStudy,
      attendedBefore,
      testimony,
      expectations,
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !ageGroup ||
      !gender ||
      !countryOfResidence ||
      !stateCity ||
      !phoneWhatsapp ||
      !email ||
      !currentStatus ||
      !institution ||
      !departmentFieldExpertise ||
      !highestDegree ||
      !expectations
    ) {
      return next(createError("Please fill in all required fields", 400));
    }

    // Check for duplicate registration by email + slug
    const existing = await db
      .select({ id: conferenceRegistration.id })
      .from(conferenceRegistration)
      .where(eq(conferenceRegistration.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return next(
        createError(
          "This email address has already been registered for this conference.",
          409,
        ),
      );
    }

    const [registration] = await db
      .insert(conferenceRegistration)
      .values({
        conferenceSlug: slug,
        fullName: fullName.trim(),
        ageGroup,
        gender,
        countryOfResidence: countryOfResidence.trim(),
        stateCity: stateCity.trim(),
        phoneWhatsapp: phoneWhatsapp.trim(),
        email: email.toLowerCase().trim(),
        currentStatus,
        institution: institution.trim(),
        departmentFieldExpertise: departmentFieldExpertise.trim(),
        highestDegree,
        yearOfStudy: yearOfStudy?.trim() || null,
        attendedBefore: Boolean(attendedBefore),
        testimony: testimony?.trim() || null,
        expectations: expectations.trim(),
      })
      .returning();

    res.status(201).json({
      success: true,
      message:
        "Registration successful! We look forward to seeing you at the conference.",
      data: { registration },
    });
  } catch (error) {
    next(createError("Registration failed. Please try again.", 500));
  }
};

// ---------------------------------------------------------------------------
// Get all registrations for a conference (admin)
// ---------------------------------------------------------------------------
export const getConferenceRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const registrations = await db
      .select()
      .from(conferenceRegistration)
      .where(eq(conferenceRegistration.conferenceSlug, slug))
      .orderBy(desc(conferenceRegistration.registeredAt));

    res.json({
      success: true,
      data: {
        registrations,
        total: registrations.length,
      },
    });
  } catch (error) {
    next(createError("Failed to fetch registrations", 500));
  }
};

// ---------------------------------------------------------------------------
// Get registration count for a conference
// ---------------------------------------------------------------------------
export const getConferenceRegistrationCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const registrations = await db
      .select({ id: conferenceRegistration.id })
      .from(conferenceRegistration)
      .where(eq(conferenceRegistration.conferenceSlug, slug));

    res.json({
      success: true,
      data: { count: registrations.length, slug },
    });
  } catch (error) {
    next(createError("Failed to get registration count", 500));
  }
};
