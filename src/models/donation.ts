import {
  pgTable,
  uuid,
  varchar,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user.js";
import { program } from "./program.js";

export const donation = pgTable("donation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  programId: uuid("program_id").references(() => program.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  donorName: varchar("donor_name", { length: 255 }),
  donorEmail: varchar("donor_email", { length: 255 }),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull()
    .default("pending"),
  paymentReference: varchar("payment_reference", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});