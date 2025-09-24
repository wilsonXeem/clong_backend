import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler.js";

const ALLOWED_FILE_TYPES = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  spreadsheets: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateResourceFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(createError("File is required", 400));
    }

    const { mimetype, size, originalname } = req.file;
    const allowedTypes = [
      ...ALLOWED_FILE_TYPES.documents,
      ...ALLOWED_FILE_TYPES.images,
      ...ALLOWED_FILE_TYPES.spreadsheets
    ];

    // Validate file type
    if (!allowedTypes.includes(mimetype)) {
      return next(createError(
        `Invalid file type '${mimetype}' for file '${originalname}'. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, WEBP, XLS, XLSX`,
        400
      ));
    }

    // Validate file size
    if (size > MAX_FILE_SIZE) {
      const fileSizeMB = (size / (1024 * 1024)).toFixed(2);
      return next(createError(
        `File '${originalname}' is too large (${fileSizeMB}MB). Maximum allowed size is 10MB`,
        400
      ));
    }

    // Validate file name
    if (!originalname || originalname.trim().length === 0) {
      return next(createError("File must have a valid name", 400));
    }

    next();
  } catch (error) {
    next(createError("File validation failed", 500));
  }
};