import { integer, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { accountsTable } from "./accounts";
import { chatsTable } from "./chats";
import { chatMessagesTable } from "./chat-messages";
import { createTable } from "../create-table";
import { vocabWordsTable } from "./vocab-words";

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
