import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env";
import { usersRelations, usersTable } from "./schema/users";
import { accountsRelations, accountsTable } from "./schema/accounts";
import {
  chatMessagesRelations,
  chatMessagesTable,
} from "./schema/chat-messages";
import {
  chatPartnersRelations,
  chatPartnersTable,
} from "./schema/chat-partners";
import { chatsRelations, chatsTable } from "./schema/chats";
import { sessionsRelations, sessionsTable } from "./schema/sessions";
import { verificationTokensTable } from "./schema/verification-tokens";
import { vocabWordsRelations, vocabWordsTable } from "./schema/vocab-words";

const schema = {
  // accounts
  accountsTable,
  accountsRelations,
  // chat_messages
  chatMessagesTable,
  chatMessagesRelations,
  // chat_partners
  chatPartnersTable,
  chatPartnersRelations,
  // chats
  chatsTable,
  chatsRelations,
  // sessions
  sessionsTable,
  sessionsRelations,
  // users
  usersTable,
  usersRelations,
  // verification
  verificationTokensTable, // doesn't have relations
  // vocabWords
  vocabWordsTable,
  vocabWordsRelations,
};

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ?? createClient({ url: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
