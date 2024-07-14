import { createTable } from "../create-table";
import { accountsTable } from "./accounts";
import { chatMessagesTable } from "./chat-messages";
import { chatsTable } from "./chats";
import { vocabWordsTable } from "./vocab-words";
import { relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

export const usersTable = createTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: integer("emailVerified", {
    mode: "timestamp",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image", { length: 255 }),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  chats: many(chatsTable),
  chatMesssages: many(chatMessagesTable),
  vocabWords: many(vocabWordsTable),
}));
