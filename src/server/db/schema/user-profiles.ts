import { createTable } from "../create-table";
import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

export const userProfilesTable = createTable("user_profile", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("userId", { length: 255 }).notNull(),

  name: text("name", { length: 1023 }).notNull(),

  gender: text("gender", { enum: ["male", "female", "nonbinary"] }).notNull(),
  dob: integer("dob", { mode: "timestamp" }).notNull(),
  // TODO: share across the app
  jlptLevel: text("jlptLevel", {
    enum: ["N1+", "N1", "N2", "N3", "N4", "N5"],
  }).notNull(),
  location: text("location", { length: 1023 }).notNull(),
  interests: text("interests", { length: 1023 }).notNull(),
  goals: text("goals", { length: 1023 }).notNull(),
});

export const userProfilesRelations = relations(
  userProfilesTable,
  ({ one }) => ({
    user: one(userProfilesTable),
  }),
);

export type UserProfileTableRow = InferSelectModel<typeof userProfilesTable>;
