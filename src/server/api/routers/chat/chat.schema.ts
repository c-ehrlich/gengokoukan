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

export const deleteChatSchema = z.object({
  chatId: z.string(),
});

export const messagesPaginatedSchema = z.object({
  chatId: z.string(),
  limit: z.number().min(1).max(100),
  cursor: z.number().nullish(), // date as unix timestamp
});

export const chatHintSchema = z.object({
  chatId: z.string(),
  lastMessageId: z.number().optional(),
});

export const chatHintAiResponseSchema = z.object({
  hint: z.string(),
  suggestedMessage: z.string(),
});
