import {
  createChatPartnerSchemaClient,
  type CreateChatPartnerSchemaClient,
} from "./create-chat.schema";
import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { chatPartnersTable } from "~/server/db/schema/chat-partners";
import { chatsTable } from "~/server/db/schema/chats";

/**
 * DB
 */

export const createChatPartner = dbCallWithSpan(
  "createChatPartner",
  async function _createChatPartner({
    db,
    input,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    input: CreateChatPartnerSchemaClient;
    userId: string;
  }) {
    return db.transaction(async (trx) => {
      const [chatPartner] = await trx
        .insert(chatPartnersTable)
        .values(input)
        .returning({ id: chatPartnersTable.id });

      if (!chatPartner) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create chat partner",
        });
      }

      const [chat] = await trx
        .insert(chatsTable)
        .values({ chatPartnerId: chatPartner.id, userId: userId })
        .returning({ id: chatsTable.id });

      if (!chat) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create chat",
        });
      }

      return { chatId: chat.id };
    });
  },
);

/**
 * PROCEDURE
 */

export const createChat = protectedProcedure
  .input(createChatPartnerSchemaClient)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;

    const { chatId } = await createChatPartner({
      db: ctx.db,
      input,
      userId,
    });

    return { chatId };
  });
