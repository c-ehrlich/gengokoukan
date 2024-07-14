import { createTable } from "../create-table";
import { usersTable } from "./users";
import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, text } from "drizzle-orm/sqlite-core";

export const vocabWordsTable = createTable(
  "vocab_word",
  {
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => usersTable.id),
    word: text("word", { length: 255 }).notNull(),

    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    srsLevel: integer("srs_level").notNull().default(0),
    nextDue: integer("next_due", { mode: "timestamp" }).notNull(),
  },
  (vocabWord) => ({
    pk: primaryKey({
      columns: [vocabWord.userId, vocabWord.word],
    }),
  }),
);

export const vocabWordsRelations = relations(vocabWordsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [vocabWordsTable.userId],
    references: [usersTable.id],
  }),
}));
