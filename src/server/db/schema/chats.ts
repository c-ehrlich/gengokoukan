import { integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { chatPartnersTable } from "./chat-partners";
import { chatMessagesTable } from "./chat-messages";
import { createTable } from "../create-table";

export const chatsTable = createTable("chat", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  user: one(usersTable),
  chat_partner: one(chatPartnersTable),
  messages: many(chatMessagesTable),
}));
