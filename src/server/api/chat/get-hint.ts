import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { Models } from "~/server/ai/models";
import { openAiPrompt } from "~/server/ai/openAiPrompt";
import { chatHistory } from "~/server/api/chat/shared_ai/chat-history";
import { getChatWithPartnerAndMessages } from "~/server/api/chat/shared_db/get-chat-with-partner-and-messages";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";
import {
  chatMessagesTable,
  type ChatMessageTableRow,
} from "~/server/db/schema/chat-messages";
import { type ChatPartnerTableRow } from "~/server/db/schema/chat-partners";

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
  partner: ChatPartnerTableRow;
  chats: Array<ChatMessageTableRow>;
};

export function chatHintPrompt({ partner, chats }: ChatHintPromptArgs) {
  const userName = "あなた";
  const partnerName = "相手";

  return `以下は二人の間で交わされた最近のメッセージです：

${chatHistory({ chats, names: { user: userName, partner: partnerName } })}

状況は：${partner.situation}

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
    const chat = await getChatWithPartnerAndMessages({
      db: ctx.db,
      chatId: input.chatId,
      userId: ctx.session.user.id,
    });

    const hintResponse = await openAiPrompt({
      prompt: {
        name: "chatHint",
        body: {
          model: Models.Powerful,
          messages: [
            {
              role: "user",
              content: chatHintPrompt({
                chats: chat.messages,
                partner: chat.chatPartner,
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
