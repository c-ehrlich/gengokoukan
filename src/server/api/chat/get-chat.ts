import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";

// TODO: use a transaction to get chat/partner separately from messages, so we can paginate the messages
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

export const getChat = protectedProcedure
  .input(z.object({ chatId: z.string() }))
  .query(async ({ ctx, input }) => {
    const chat = await getChatWithPartnerAndMessages({
      db: ctx.db,
      chatId: input.chatId,
      userId: ctx.session.user.id,
    });

    return chat;
  });
