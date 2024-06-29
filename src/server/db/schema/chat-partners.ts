import { integer, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createTable } from "../create-table";
import { chatsTable } from "./chats";

const formalityOptions = [
  "jidou",
  "yobisute",
  "tameguchi",
  "futsu",
  "teinei",
  "keigo",
  "sonkeigo",
  "kenjougo",
] as const;
export type FormalityOption = (typeof formalityOptions)[number];

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
  relation: text("relation", { length: 1023 }),
  situation: text("situation", { length: 1023 }),

  formality: text("formality", {
    enum: formalityOptions,
  }),
});
export const chatPartnersRelations = relations(
  chatPartnersTable,
  ({ one }) => ({
    chat: one(chatsTable),
  }),
);

export type ChatPartnerTableRow = InferSelectModel<typeof chatPartnersTable>;
