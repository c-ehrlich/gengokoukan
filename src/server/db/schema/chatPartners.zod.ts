import { createInsertSchema } from "drizzle-zod";
import { chatPartnersTable } from "./chatPartners";

export const createChatPartnerSchemaServer =
  createInsertSchema(chatPartnersTable);

export const createChatPartnerSchemaClient = createChatPartnerSchemaServer.omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true,
  },
);
