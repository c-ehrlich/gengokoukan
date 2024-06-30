import { integer, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createTable } from "../create-table";
import { chatsTable } from "./chats";

export const formalities = [
  "jidou",
  "yobisute",
  "tameguchi",
  "futsu",
  "teinei",
  "keigo",
  "sonkeigo",
  "kenjougo",
] as const;
export type FormalityOption = (typeof formalities)[number];

export function formalityStringFromOption(option: FormalityOption) {
  switch (option) {
    case "jidou":
      return "関係や状況に応じて、自動的に適切な敬語レベルを選択する";
    case "yobisute":
      return "呼び捨て (Yobisute)";
    case "tameguchi":
      return "タメ口 (Tameguchi)";
    case "futsu":
      return "普通 (Futsū)";
    case "teinei":
      return "丁寧 (Teinei)";
    case "keigo":
      return "敬語 (Keigo)";
    case "sonkeigo":
      return "尊敬語 (Sonkeigo)";
    case "kenjougo":
      return "謙譲語 (Kenjōgo)";
  }
}

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
    enum: formalities,
  }),
});
export const chatPartnersRelations = relations(
  chatPartnersTable,
  ({ one }) => ({
    chat: one(chatsTable),
  }),
);

export type ChatPartnerTableRow = InferSelectModel<typeof chatPartnersTable>;
