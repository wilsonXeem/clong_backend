import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const volunteer = pgTable("volunteer", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  skills: varchar("skills", { length: 500 }),
  availability: varchar("availability", { length: 200 }),
  interests: varchar("interests", { length: 300 }),
  experience: text("experience"),
  motivation: text("motivation"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected, active
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
