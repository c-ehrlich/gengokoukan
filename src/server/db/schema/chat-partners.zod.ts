import { createInsertSchema } from "drizzle-zod";
import { chatPartnersTable } from "./chat-partners";

export const createChatPartnerSchemaServer =
  createInsertSchema(chatPartnersTable);

export const createChatPartnerSchemaClient = createChatPartnerSchemaServer.omit(
  {
    id: true,
    createdAt: true,
  },
);
