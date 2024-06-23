import { integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { chatsTable } from "./chats";
import { createTable } from "../create-table";

export const chatPartnersTable = createTable("chat_partner", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),

  name: text("name", { length: 255 }),
  age: integer("age", { mode: "number" }),
  origin: text("origin", { length: 255 }),

  personality: text("personality", { length: 1023 }),
  interests: text("interests", { length: 1023 }),
});

export const chatPartnersRelations = relations(
  chatPartnersTable,
  ({ one }) => ({
    chat: one(chatsTable),
  }),
);
