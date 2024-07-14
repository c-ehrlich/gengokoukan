import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { chatsTable } from "~/server/db/schema/chats";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * SCHEMA
 */

const deleteChatSchema = z.object({
  chatId: z.string(),
});

/**
 * PROCEDURE
 */

export const deleteChat = protectedProcedure
  .input(deleteChatSchema)
  .mutation(async ({ ctx, input }) => {
    const [deletedChat] = await ctx.db
      .delete(chatsTable)
      .where(
        and(
          eq(chatsTable.id, input.chatId),
          eq(chatsTable.userId, ctx.session.user.id),
        ),
      )
      .returning({ id: chatsTable.id });

    if (!deletedChat) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return { chatId: deletedChat.id };
  });
