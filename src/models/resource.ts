import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const resource = pgTable("resource", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  isPublic: boolean("is_public").notNull().default(true),
  uploadedBy: uuid("uploaded_by").references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});