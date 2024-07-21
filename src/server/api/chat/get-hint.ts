import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { Models } from "~/server/ai/models";
import { openAiPrompt } from "~/server/ai/open-ai-prompt";
import { PromptNames } from "~/server/ai/prompt-names";
import { chatHistory } from "~/server/api/chat/shared_ai/chat-history";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import {
  chatMessagesTable,
  type ChatMessageTableRow,
} from "~/server/db/schema/chat-messages";

/**
 * SCHEMA
 */

const chatHintSchema = z.object({
  chatId: z.string(),
  lastMessageId: z.number().optional(),
});

const chatHintAiResponseSchema = z.object({
  hint: z.string(),
  suggestedMessage: z.string(),
});

/**
 * PROMPT
 */

type ChatHintPromptArgs = {
  messages: Array<ChatMessageTableRow>;
};

export function chatHintPrompt({ messages }: ChatHintPromptArgs) {
  const userName = "相手";
  const partnerName = "あなた";

  return `以下は二人の間で交わされた最近のメッセージです：

${chatHistory({ messages: messages, names: { user: userName, partner: partnerName } })}

次の項目を提供してください：

${userName}が次に言うと良いことのヒント
${userName}が送ると良いとされるメッセージ
次の形式で提供してください。JSON解析可能である必要があります：

{
  "hint": "<hint>",
  "suggestedMessage": "<suggested message>"
}`;
}

/**
 * DB
 */

const getRecentChatMessagesForHint = dbCallWithSpan(
  "getRecentChatMessagesForHint",
  async ({
    db,
    chatId,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
  }) => {
    const messages = await db.query.chatMessagesTable.findMany({
      where: (messages, { and, eq }) =>
        and(eq(messages.chatId, chatId), eq(messages.userId, userId)),
      limit: 10,
    });

    if (!messages) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Chat not found",
      });
    }

    return messages;
  },
);

export const insertChatHint = dbCallWithSpan(
  "insertChatHint",
  async ({
    db,
    chatId,
    userId,
    hint,
    suggestedMessage,
  }: {
    db: LibSQLDatabase<DBSchema>;
    chatId: string;
    userId: string;
    hint: string;
    suggestedMessage: string;
  }) => {
    await db.insert(chatMessagesTable).values([
      {
        chatId: chatId,
        userId: userId,
        createdAt: new Date(),
        author: "hint",

        text: "", // TODO: not ideal

        hint: hint,
        suggestedMessage: suggestedMessage,
      },
    ]);
  },
);

/**
 * PROCEDURE
 */

export const getHint = protectedProcedure
  .input(chatHintSchema)
  .mutation(async ({ ctx, input }) => {
    const messages = await getRecentChatMessagesForHint({
      db: ctx.db,
      chatId: input.chatId,
      userId: ctx.session.user.id,
    });

    // TODO: handle the case where no messages have been sent yet
    const hintResponse = await openAiPrompt({
      prompt: {
        name: PromptNames.Chat.Hint,
        body: {
          model: Models.Powerful,
          messages: [
            {
              role: "user",
              content: chatHintPrompt({
                messages,
              }),
            },
          ],
        },
      },
      schema: chatHintAiResponseSchema,
    });

    await insertChatHint({
      db: ctx.db,
      chatId: input.chatId,
      userId: ctx.session.user.id,
      hint: hintResponse.hint,
      suggestedMessage: hintResponse.suggestedMessage,
    });

    return {
      ...hintResponse,
      lastMessageId: input.lastMessageId,
    };
  });
