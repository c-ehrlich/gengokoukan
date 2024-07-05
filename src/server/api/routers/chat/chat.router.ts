import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { OpenAI } from "../../ai/openai";
import { TRPCError } from "@trpc/server";
import { chatPrompt } from "./chat.prompts";
import { createChatPartnerSchemaClient } from "~/server/db/schema/chat-partners.zod";
import {
  type ChatPartnerTableRow,
  chatPartnersTable,
} from "~/server/db/schema/chat-partners";
import { chatsTable } from "~/server/db/schema/chats";
import {
  deleteChatSchema,
  messagesPaginatedSchema,
  sendMessageAiResponseSchema,
  sendMessageInputSchema,
} from "./chat.schema";
import { and, desc, eq, lt } from "drizzle-orm";
import {
  type ChatMessageTableRow,
  chatMessagesTable,
} from "~/server/db/schema/chat-messages";

const CREATE_RESPONSE_MODEL = "gpt-4o-2024-05-13";

const message = ({
  partner,
  userMessage,
  messages,
}: {
  partner: ChatPartnerTableRow;
  userMessage: string;
  messages: ChatMessageTableRow[];
}) =>
  chatPrompt({
    user: {
      name: "クリス",
      age: 34,
      gender: "male",
      location: "Vienna, Austria",
      goals:
        "Improve my Japanese speaking skills, in particular to talk to my in-laws.",
      interests: "I like to cook and play video games.",
      jlptLevel: "N1",
    },
    partner: partner,
    chats: messages.reverse(),
    newUserMessage: userMessage,
  });

export const chatRouter = createTRPCRouter({
  createChat: protectedProcedure
    .input(createChatPartnerSchemaClient)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const { chatId } = await ctx.db.transaction(async (trx) => {
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

      return { chatId };
    }),

  deleteChat: protectedProcedure
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
    }),

  messages: protectedProcedure
    .input(messagesPaginatedSchema)
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db
        .select()
        .from(chatMessagesTable)
        .where(
          and(
            eq(chatMessagesTable.chatId, input.chatId),
            eq(chatMessagesTable.userId, ctx.session.user.id),
            input.cursor
              ? lt(chatMessagesTable.createdAt, new Date(input.cursor))
              : undefined,
          ),
        )
        .orderBy(desc(chatMessagesTable.createdAt));

      return messages;
    }),

  sendMessage: protectedProcedure
    .input(sendMessageInputSchema)
    // TODO: output schema
    .mutation(async ({ ctx, input }) => {
      const userMessageTimetamp = Date.now();

      const chat = await ctx.db.query.chatsTable.findFirst({
        where: and(
          eq(chatsTable.id, input.chatId),
          eq(chatsTable.userId, ctx.session.user.id),
        ),
        with: {
          chat_partner: true,
          messages: {
            limit: 100,
            orderBy: (message, { desc }) => [desc(message.createdAt)],
          },
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      const chatCompletion = await OpenAI.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message({
              userMessage: input.text,
              partner: chat?.chat_partner,
              messages: chat.messages,
            }),
          },
        ],
        // TODO: maybe limit free plan to 10 4o messages per day
        model: "gpt-4o-2024-05-13",
      });

      if (!chatCompletion.choices[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a message",
        });
      }

      const rawMessage = chatCompletion.choices[0].message.content;
      const extractedJson = (rawMessage?.match(/\{[\s\S]*\}/) ?? [])[0];
      console.log("ai response", {
        raw: rawMessage,
        jsonString: extractedJson,
      });

      let jsonParsed: unknown;
      try {
        jsonParsed = JSON.parse(extractedJson ?? "null");
      } catch (e) {
        console.error("error parsing model response:", e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a valid message",
        });
      }

      const contentParsed = sendMessageAiResponseSchema.safeParse(jsonParsed);

      if (!contentParsed.success) {
        console.error("error parsing model response:", contentParsed.error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a valid message",
        });
      }

      const res = await ctx.db
        .insert(chatMessagesTable)
        .values([
          {
            chatId: chat.id,
            userId: ctx.session.user.id,
            createdAt: new Date(userMessageTimetamp),
            author: "user",
            text: input.text,
          },
          {
            chatId: chat.id,
            userId: ctx.session.user.id,
            createdAt: new Date(),
            author: "ai",
            model: CREATE_RESPONSE_MODEL,
            text: contentParsed.data.reply,
            feedback: contentParsed.data.feedback,
            corrected: contentParsed.data.rewritten,
          },
        ])
        .returning();

      const aiResponse = res[1]!; // TODO: dont assert

      return {
        reply: aiResponse.text,
        feedback: aiResponse.feedback,
        rewritten: aiResponse.corrected,
        timestamp: aiResponse.createdAt.getTime(),
      };
    }),
});
