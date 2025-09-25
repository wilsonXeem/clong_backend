import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "./env.js";
import * as schema from "../models/index.js";

// Ensure DATABASE_URL has correct protocol
const dbUrl = DATABASE_URL.startsWith('postgres://') ? DATABASE_URL : `postgres://${DATABASE_URL}`;

// Create PostgreSQL connection with SSL configuration
const client = postgres(dbUrl, {
  ssl: 'require'
});

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export client for migrations
export { client };

// Export schema for use in other files
export { schema };
