-- Migration: Update volunteer table to include personal information fields
-- Date: 2024-01-08

-- Add personal information columns to volunteer table
ALTER TABLE "volunteer" 
ADD COLUMN "first_name" varchar(100) NOT NULL DEFAULT '',
ADD COLUMN "last_name" varchar(100) NOT NULL DEFAULT '',
ADD COLUMN "email" varchar(255) NOT NULL DEFAULT '',
ADD COLUMN "phone" varchar(20) NOT NULL DEFAULT '';

-- Make user_id nullable (optional)
ALTER TABLE "volunteer" 
ALTER COLUMN "user_id" DROP NOT NULL;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "volunteer_email_idx" ON "volunteer" ("email");

-- Remove default empty strings after adding columns
ALTER TABLE "volunteer" 
ALTER COLUMN "first_name" DROP DEFAULT,
ALTER COLUMN "last_name" DROP DEFAULT,
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "phone" DROP DEFAULT;