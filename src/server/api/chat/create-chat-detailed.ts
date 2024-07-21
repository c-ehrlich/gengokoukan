import { createChatSchemaClient } from "./create-chat-detailed.schema";
import { createChat } from "./shared_db/create-chat";
import { protectedProcedure } from "~/server/api/trpc";

export const createChatDetailed = protectedProcedure
  .input(createChatSchemaClient)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id;

    const { chatId } = await createChat({
      db: ctx.db,
      input,
      userId,
    });

    return { chatId };
  });
