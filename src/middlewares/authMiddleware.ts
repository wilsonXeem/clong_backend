import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { createError } from "./errorHandler.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(createError("Access denied. No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    next(createError("Invalid token", 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("Access denied. Please authenticate first", 401));
    }

    console.log('User role:', req.user.role, 'Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
      return next(createError("Access denied. Insufficient permissions", 403));
    }

    next();
  };
};