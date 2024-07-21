import { createChatSchemaServer } from "./shared_schema/create-chat.schema";
import { type z } from "zod";

export const createChatSchemaClient = createChatSchemaServer.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type CreateChatSchemaClient = z.infer<typeof createChatSchemaClient>;
