import { and, desc, eq, lt } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";
import { chatMessagesTable } from "~/server/db/schema/chat-messages";

/**
 * SCHEMA
 */

const messagesPaginatedSchema = z.object({
  chatId: z.string(),
  limit: z.number().min(1).max(100),
  cursor: z.number().nullish(), // date as unix timestamp
});

/**
 * DB
 */

const getPaginatedMessages = dbCallWithSpan(
  "getPaginatedMessages",
  async ({
    db,
    chatId,
    userId,
    // limit,
    cursor,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
    // limit: number;
    cursor?: number | null;
  }) => {
    // TODO: limit
    return db
      .select()
      .from(chatMessagesTable)
      .where(
        and(
          eq(chatMessagesTable.chatId, chatId),
          eq(chatMessagesTable.userId, userId),
          cursor
            ? lt(chatMessagesTable.createdAt, new Date(cursor))
            : undefined,
        ),
      )
      .orderBy(desc(chatMessagesTable.createdAt));
  },
);

/**
 * PROCEDURE
 */

export const getMessages = protectedProcedure
  .input(messagesPaginatedSchema)
  .query(async ({ ctx, input }) => {
    const messages = await getPaginatedMessages({
      db: ctx.db,
      userId: ctx.session.user.id,
      ...input,
    });

    return messages;
  });
