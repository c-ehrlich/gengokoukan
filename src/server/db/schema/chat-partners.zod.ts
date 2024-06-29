import { createInsertSchema } from "drizzle-zod";
import { chatPartnersTable } from "./chat-partners";

export const createChatPartnerSchemaServer = createInsertSchema(
  chatPartnersTable,
  {
    name: (schema) => schema.name.min(1, "名前は1文字以上である必要がある"),
  },
);

export const createChatPartnerSchemaClient = createChatPartnerSchemaServer.omit(
  {
    id: true,
    createdAt: true,
  },
);
