import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { OpenAI } from "../../ai/openai";
import { TRPCError } from "@trpc/server";
import { chatPrompt } from "./chat.prompts";
import { timestamp } from "drizzle-orm/pg-core";

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
  sendMessage: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const chatCompletion = await OpenAI.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message(input.text),
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

      try {
        console.log(chatCompletion.choices[0].message.content);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(chatCompletion.choices[0].message.content!);
        const res = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          feedback: parsed.feedback as string | undefined,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          rewritten: parsed.rewritten as string | undefined,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          reply: parsed.reply as string,
          timestamp: Date.now(),
        };
        return res;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return a valid message",
        });
      }
    }),
});
