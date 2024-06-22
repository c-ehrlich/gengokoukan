import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { OpenAI } from "../ai/openai";
import { TRPCError } from "@trpc/server";

export const chatRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const chatCompletion = await OpenAI.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Repeat back the following message: ${input.text}. Then add a word that rhymes with the last word in the message.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      console.log(JSON.stringify(chatCompletion));

      if (!chatCompletion.choices[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a message",
        });
      }

      const reply = {
        message: chatCompletion.choices[0].message.content!,
        timestamp: chatCompletion.created,
      };

      return reply;
    }),
});
