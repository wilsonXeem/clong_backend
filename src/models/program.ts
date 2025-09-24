import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const program = pgTable("program", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
