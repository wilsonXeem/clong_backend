import { db } from "./src/config/db.js";
import * as schema from "./src/models/index.js";

async function clearDatabase() {
  try {
    console.log("🗑️  Clearing database...");
    
    // Delete all data from tables (order matters due to foreign keys)
    await db.delete(schema.eventRegistration);
    await db.delete(schema.newsletter);
    await db.delete(schema.contact);
    await db.delete(schema.volunteer);
    await db.delete(schema.donation);
    await db.delete(schema.article);
    await db.delete(schema.story);
    await db.delete(schema.resource);
    await db.delete(schema.event);
    await db.delete(schema.program);
    await db.delete(schema.user);
    
    console.log("✅ Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
}

clearDatabase();