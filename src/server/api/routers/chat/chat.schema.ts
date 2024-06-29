import { z } from "zod";

export const sendMessageInputSchema = z.object({
  chatId: z.string(),
  text: z.string(),
});

export const sendMessageOutputSchema = z.object({
  reply: z.string(),
  feedback: z.string().optional(),
  rewritten: z.string().optional(),
  timestamp: z.number(),
});

export const sendMessageAiResponseSchema = sendMessageOutputSchema.omit({
  timestamp: true,
});
