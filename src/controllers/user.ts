import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { user } from "../models/user.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import { createError } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { eq } from "drizzle-orm";

const generateToken = (userId: string, userRole: string, userEmail: string) => {
  return jwt.sign({ id: userId, role: userRole, email: userEmail }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (existingUser.length > 0) {
      return next(createError("User already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(user)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      })
      .returning({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

    // Generate token
    const token = generateToken(newUser.id, 'user', newUser.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user: newUser, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (!foundUser) {
      return next(createError("Invalid credentials", 401));
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return next(createError("Invalid credentials", 401));
    }

    // Generate token
    const token = generateToken(foundUser.id, foundUser.role, foundUser.email);

    const { password: _, ...userWithoutPassword } = foundUser;

    res.json({
      success: true,
      message: "Login successful",
      data: { user: userWithoutPassword, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [foundUser] = await db
      .select({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, req.user!.id));

    if (!foundUser) {
      return next(createError("User not found", 404));
    }

    res.json({
      success: true,
      data: { user: foundUser },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const [updatedUser] = await db
      .update(user)
      .set({ firstName, lastName, phone, updatedAt: new Date() })
      .where(eq(user.id, req.user!.id))
      .returning({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await db
      .select({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user);

    res.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Check if current user is admin
    if (req.user!.role !== 'admin') {
      return next(createError('Access denied. Admin role required.', 403));
    }

    const [updatedUser] = await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });

    if (!updatedUser) {
      return next(createError('User not found', 404));
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Check if current user is admin
    if (req.user!.role !== 'admin') {
      return next(createError('Access denied. Admin role required.', 403));
    }

    // Get current user status
    const [currentUser] = await db
      .select({ isActive: user.isActive })
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser) {
      return next(createError('User not found', 404));
    }

    const [updatedUser] = await db
      .update(user)
      .set({ isActive: !currentUser.isActive, updatedAt: new Date() })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
      });

    res.json({
      success: true,
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Check if current user is admin
    if (req.user!.role !== 'admin') {
      return next(createError('Access denied. Admin role required.', 403));
    }

    // Prevent admin from deleting themselves
    if (req.user!.id === userId) {
      return next(createError('Cannot delete your own account', 400));
    }

    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, userId))
      .returning({ id: user.id, email: user.email });

    if (!deletedUser) {
      return next(createError('User not found', 404));
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};
