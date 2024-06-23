import { index, integer, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./users";
import { createTable } from "../createTable";

export const sessionsTable = createTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => usersTable.id),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
