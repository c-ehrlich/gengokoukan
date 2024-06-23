import { integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { usersTable } from "./users";
import { chatsTable } from "./chats";
import { createTable } from "../create-table";

export const chatMessagesTable = createTable("chat_message", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),

  author: text("author", { enum: ["user", "ai"] }),
  is_openai_error: integer("is_openai_error", { mode: "boolean" }),

  text: text("text"),
  model: text("model", { length: 63 }),
  prompt_tokens: integer("prompt_tokens", { mode: "number" }),
  completion_tokens: integer("completion_tokens", { mode: "number" }),
  prompt_version: integer("prompt_version", { mode: "number" }),
});

export const chatMessagesRelations = relations(
  chatMessagesTable,
  ({ one }) => ({
    user: one(usersTable),
    chat: one(chatsTable),
  }),
);