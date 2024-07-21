import { type CreateChatSchemaClient } from "../create-chat-detailed.schema";
import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { chatsTable } from "~/server/db/schema/chats";

export const createChat = dbCallWithSpan(
  "createChat",
  async function _createChatDetailedDb({
    db,
    input,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    input: CreateChatSchemaClient;
    userId: string;
  }) {
    const [chat] = await db
      .insert(chatsTable)
      .values({ ...input, userId: userId })
      .returning({ id: chatsTable.id });

    if (!chat) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not create chat",
      });
    }

    return { chatId: chat.id };
  },
);
