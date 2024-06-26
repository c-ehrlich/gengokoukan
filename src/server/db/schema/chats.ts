import { integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { chatPartnersTable } from "./chat-partners";
import { chatMessagesTable } from "./chat-messages";
import { createTable } from "../create-table";

export const chatsTable = createTable("chat", {
  // START RELATIONS
  // userId: text("user_id", { length: 255 }).references(() => usersTable.id),
  // chatPartnerId: text("chat_partner_id", { length: 255 }).references(
  //   () => chatPartnersTable.id,
  // ),
  // // END RELATIONS

  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  // user: one(usersTable, {
  //   fields: [chatsTable.userId],
  //   references: [usersTable.id],
  // }),
  // chat_partner: one(chatPartnersTable),
  messages: many(chatMessagesTable),
}));
