import { createTable } from "../create-table";
import { type ChatMessageTableRow, chatMessagesTable } from "./chat-messages";
import { usersTable } from "./users";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

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

export const genderStrings = {
  male: "男性",
  female: "女性",
  nonbinary: "ノンバイナリー",
} as const;

export const chatsTable = createTable("chat", {
  // RELATIONS
  userId: text("user_id", { length: 255 })
    .references(() => usersTable.id)
    .notNull(),

  id: text("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  partnerName: text("partner_name", { length: 255 }).notNull(),
  partnerGender: text("partner_gender", {
    enum: ["male", "female", "nonbinary"],
  }).notNull(),
  partnerAge: integer("partner_age", { mode: "number" }).notNull(),
  partnerOrigin: text("partner_origin", { length: 255 }).notNull(),

  partnerPersonality: text("partner_personality", { length: 1023 }),
  partnerRelation: text("partner_relation", { length: 1023 }),
  partnerSituation: text("partner_situation", { length: 1023 }),

  partnerFormality: text("partner_formality", {
    enum: formalities,
  }),
});

export const chatsRelations = relations(chatsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [chatsTable.userId],
    references: [usersTable.id],
  }),
  messages: many(chatMessagesTable),
}));

export type ChatTableRow = InferSelectModel<typeof chatsTable>;

export type ChatWithMessages = ChatTableRow & {
  messages: ChatMessageTableRow[];
};
