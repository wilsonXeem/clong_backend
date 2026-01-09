import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const volunteer = pgTable("volunteer", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  skills: varchar("skills", { length: 500 }),
  availability: varchar("availability", { length: 200 }),
  interests: varchar("interests", { length: 300 }),
  experience: text("experience"),
  motivation: text("motivation"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected, active
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
