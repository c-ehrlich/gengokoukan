import { integer, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createTable } from "../create-table";
import { chatsTable } from "./chats";

export const chatPartnersTable = createTable("chat_partner", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  name: text("name", { length: 255 }).notNull(),
  gender: text("gender", { enum: ["male", "female", "nonbinary"] }).notNull(),
  age: integer("age", { mode: "number" }).notNull(),
  origin: text("origin", { length: 255 }).notNull(),

  personality: text("personality", { length: 1023 }),
  interests: text("interests", { length: 1023 }),
});
export const chatPartnersRelations = relations(
  chatPartnersTable,
  ({ one }) => ({
    chat: one(chatsTable),
  }),
);

export type ChatPartnerTableRow = InferSelectModel<typeof chatPartnersTable>;
