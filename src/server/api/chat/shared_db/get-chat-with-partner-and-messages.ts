import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";

import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";

export const getChatWithPartnerAndMessages = dbCallWithSpan(
  "getChatWithPartnerAndMessages",
  async ({
    db,
    chatId,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
  }) => {
    const chat = await db.query.chatsTable.findFirst({
      where: (chats, { and, eq }) =>
        and(eq(chats.id, chatId), eq(chats.userId, userId)),
      with: {
        chatPartner: true,
        messages: true,
      },
    });

    if (!chat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return chat;
  },
);
