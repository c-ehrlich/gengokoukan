import { createInsertSchema } from "drizzle-zod";
import { chatsTable } from "~/server/db/schema/chats";

export const createChatSchemaServer = createInsertSchema(chatsTable, {
  partnerName: (schema) =>
    schema.partnerName.min(1, "名前は1文字以上である必要がある"),
});
