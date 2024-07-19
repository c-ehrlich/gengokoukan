import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { chatsTable } from "~/server/db/schema/chats";

/**
 * SCHEMA
 */

const deleteChatSchema = z.object({
  chatId: z.string(),
});

/**
 * DB
 */

export const deleteChatDb = dbCallWithSpan(
  "deleteChat",
  async ({
    db,
    chatId,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
  }) => {
    return db
      .delete(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.userId, userId)))
      .returning({ id: chatsTable.id });
  },
);

/**
 * PROCEDURE
 */

export const deleteChat = protectedProcedure
  .input(deleteChatSchema)
  .mutation(async ({ ctx, input }) => {
    const [deletedChat] = await deleteChatDb({
      db: ctx.db,
      chatId: input.chatId,
      userId: ctx.session.user.id,
    });

    if (!deletedChat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return { chatId: deletedChat.id };
  });
