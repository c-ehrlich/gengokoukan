import { createTable } from "../create-table";
import { chatsTable } from "./chats";
import { usersTable } from "./users";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

export const chatMessagesTable = createTable("chat_message", {
  // RELATIONS
  chatId: text("chat_id", { length: 255 })
    .references(() => chatsTable.id)
    .notNull(),
  userId: text("user_id", { length: 255 })
    .references(() => usersTable.id)
    .notNull(),

  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  author: text("author", { enum: ["user", "ai", "hint"] }).notNull(),

  isOpenAIError: integer("is_openai_error", { mode: "boolean" }),

  text: text("text", { length: 1023 }).notNull(),
  feedback: text("feedback", { length: 1023 }),
  corrected: text("corrected", { length: 1023 }),

  hint: text("hint", { length: 1023 }),
  suggestedMessage: text("suggested_message", { length: 1023 }),

  model: text("model", { length: 63 }),
  promptTokens: integer("prompt_tokens", { mode: "number" }),
  completionTokens: integer("completion_tokens", { mode: "number" }),
  promptVersion: integer("prompt_version", { mode: "number" }),
});

export const chatMessagesRelations = relations(
  chatMessagesTable,
  ({ one }) => ({
    chat: one(chatsTable, {
      fields: [chatMessagesTable.chatId],
      references: [chatsTable.id],
    }),
    user: one(usersTable, {
      fields: [chatMessagesTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export type ChatMessageTableRow = InferSelectModel<typeof chatMessagesTable>;
