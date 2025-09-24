import { config } from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
config();

// Define the schema for environment variables
const envSchema = z.object({
  // Server Configuration
  PORT: z.string().default("5000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  FRONTEND_URL: z.string().optional(),

  // Database Configuration
  DATABASE_URL: z.string().min(1, "Database URL is required"),

  // JWT Configuration
  JWT_SECRET: z.string().min(1, "JWT secret is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API key is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API secret is required"),

  // Payment Configuration (Optional)
  //   PAYSTACK_SECRET_KEY: z.string().optional(),
  //   STRIPE_SECRET_KEY: z.string().optional(),
  //   FLUTTERWAVE_SECRET_KEY: z.string().optional(),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
};

// Export validated environment variables
export const env = parseEnv();

// Export individual values for convenience
export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  //   PAYSTACK_SECRET_KEY,
  //   STRIPE_SECRET_KEY,
  //   FLUTTERWAVE_SECRET_KEY,
} = env;
