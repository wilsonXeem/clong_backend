import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { event } from "./event.js";
import { user } from "./user.js";

export const eventRegistration = pgTable("event_registration", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .references(() => event.id)
    .notNull(),
  userId: uuid("user_id").references(() => user.id),
  attendeeName: varchar("attendee_name", { length: 255 }).notNull(),
  attendeeEmail: varchar("attendee_email", { length: 255 }).notNull(),
  attendeePhone: varchar("attendee_phone", { length: 20 }),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});