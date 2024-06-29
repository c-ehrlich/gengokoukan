import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { OpenAI } from "../../ai/openai";
import { TRPCError } from "@trpc/server";
import { chatPrompt } from "./chat.prompts";
import { createChatPartnerSchemaClient } from "~/server/db/schema/chat-partners.zod";
import { chatPartnersTable } from "~/server/db/schema/chat-partners";
import { chatsTable } from "~/server/db/schema/chats";
import {
  sendMessageAiResponseSchema,
  sendMessageInputSchema,
  sendMessageOutputSchema,
} from "./chat.schema";

const message = (newUserMessage: string) =>
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
    partner: {
      name: "健太",
      age: 35,
      gender: "female",
      location: "Shiga, Kansai",
      interests: "釣りと料理",
      personality: "I'm shy at first, but I open up quickly.",
    },
    chats: [],
    newUserMessage: newUserMessage,
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

  sendMessage: protectedProcedure
    .input(sendMessageInputSchema)
    .output(sendMessageOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: get the chat id, make sure it belongs to the user

      const chatCompletion = await OpenAI.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message(input.text),
          },
        ],
        // TODO: maybe limit free plan to 10 4o messages per day
        model: "gpt-4o-2024-05-13",
      });

      console.log(JSON.stringify(chatCompletion));

      if (!chatCompletion.choices[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a message",
        });
      }

      try {
        console.log(chatCompletion.choices[0].message.content);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsonParsed = JSON.parse(
          chatCompletion.choices[0].message.content!,
        );
        const zodParsed = sendMessageAiResponseSchema.parse(jsonParsed);
        const res = { ...zodParsed, timestamp: Date.now() };
        return res;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a valid message",
        });
      }
    }),
});
