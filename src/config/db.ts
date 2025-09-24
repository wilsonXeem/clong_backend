import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "./env.js";
import * as schema from "../models/index.js";

// Create PostgreSQL connection with SSL configuration
const client = postgres(DATABASE_URL, {
  ssl: 'require'
});

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export client for migrations
export { client };

// Export schema for use in other files
export { schema };
