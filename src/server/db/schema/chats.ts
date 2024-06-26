import { integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { chatPartnersTable } from "./chat-partners";
import { chatMessagesTable } from "./chat-messages";
import { createTable } from "../create-table";

export const chatsTable = createTable("chat", {
  // RELATIONS
  userId: text("user_id", { length: 255 })
    .references(() => usersTable.id)
    .notNull(),
  chatPartnerId: text("chat_partner_id", { length: 255 })
    .references(() => chatPartnersTable.id)
    .notNull(),

  id: text("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [chatsTable.userId],
    references: [usersTable.id],
  }),
  chat_partner: one(chatPartnersTable, {
    fields: [chatsTable.chatPartnerId],
    references: [chatPartnersTable.id],
  }),
  messages: many(chatMessagesTable),
}));
