import { TRPCError } from "@trpc/server";
import { and, desc, eq, lt } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { type DBSchema } from "~/server/db";
import { chatMessagesTable } from "~/server/db/schema/chat-messages";
import { chatsTable } from "~/server/db/schema/chats";

export async function getPaginatedMessages({
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
}) {
  // TODO: limit
  return db
    .select()
    .from(chatMessagesTable)
    .where(
      and(
        eq(chatMessagesTable.chatId, chatId),
        eq(chatMessagesTable.userId, userId),
        cursor ? lt(chatMessagesTable.createdAt, new Date(cursor)) : undefined,
      ),
    )
    .orderBy(desc(chatMessagesTable.createdAt));
}

export async function getChatWithPartnerAndMessages({
  db,
  chatId,
  userId,
}: {
  db: LibSQLDatabase<DBSchema>;
  chatId: string;
  userId: string;
}) {
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
}

export async function getChatList({
  db,
  userId,
}: {
  db: LibSQLDatabase<DBSchema>;
  userId: string;
}) {
  return db.query.chatsTable.findMany({
    with: {
      chatPartner: true,
      messages: {
        where: eq(chatMessagesTable.author, "ai"),
        limit: 1,
        orderBy: (message, { desc }) => desc(message.createdAt),
      },
    },
    where: eq(chatsTable.userId, userId),
    // TODO: use updatedAt instead
    orderBy: (chat, { desc }) => desc(chat.createdAt),
    // TODO: infinite scroll
    limit: 50,
  });
}
