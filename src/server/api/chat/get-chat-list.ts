import { eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { chatMessagesTable } from "~/server/db/schema/chat-messages";
import { chatsTable } from "~/server/db/schema/chats";

const getChatListDB = dbCallWithSpan(
  "getChatList",
  async ({ db, userId }: { db: LibSQLDatabase<DBSchema>; userId: string }) => {
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
  },
);

export const getChatList = protectedProcedure.query(async ({ ctx }) => {
  const chats = await getChatListDB({
    db: ctx.db,
    userId: ctx.session.user.id,
  });

  return chats;
});
