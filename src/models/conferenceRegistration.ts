import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const conferenceRegistration = pgTable("conference_registration", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Which conference / event slug this is for
  conferenceSlug: varchar("conference_slug", { length: 100 }).notNull(),

  // Section 1 — Personal Details
  fullName: varchar("full_name", { length: 255 }).notNull(),
  ageGroup: varchar("age_group", { length: 20 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  countryOfResidence: varchar("country_of_residence", {
    length: 100,
  }).notNull(),
  stateCity: varchar("state_city", { length: 100 }).notNull(),
  phoneWhatsapp: varchar("phone_whatsapp", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),

  // Section 2 — Academic & Professional Background
  currentStatus: varchar("current_status", { length: 50 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  departmentFieldExpertise: varchar("department_field_expertise", {
    length: 255,
  }).notNull(),
  highestDegree: varchar("highest_degree", { length: 30 }).notNull(),
  yearOfStudy: varchar("year_of_study", { length: 30 }),

  // Section 3 — Church / Ministry (optional)
  ministerName: varchar("minister_name", { length: 255 }),
  churchMinistry: varchar("church_ministry", { length: 255 }),
  ministerPosition: varchar("minister_position", { length: 100 }),

  // Section 4 — Conference Engagement
  attendedBefore: boolean("attended_before").notNull().default(false),
  testimony: text("testimony"),
  expectations: text("expectations").notNull(),

  // Meta
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});
