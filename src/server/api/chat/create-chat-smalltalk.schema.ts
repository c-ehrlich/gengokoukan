import { z } from "zod";

export const createChatSmalltalkSchema = z.object({
  relation: z.enum(["family", "friend", "acquaintance"]),
  topic: z.string().min(1),
});
export type CreateChatSmalltalkSchema = z.infer<
  typeof createChatSmalltalkSchema
>;
