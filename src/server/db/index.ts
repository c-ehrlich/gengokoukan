import packageJson from "../../../package.json";
import { accountsRelations, accountsTable } from "./schema/accounts";
import {
  chatMessagesRelations,
  chatMessagesTable,
} from "./schema/chat-messages";
import { chatsRelations, chatsTable } from "./schema/chats";
import { sessionsRelations, sessionsTable } from "./schema/sessions";
import {
  userProfilesRelations,
  userProfilesTable,
} from "./schema/user-profiles";
import { usersRelations, usersTable } from "./schema/users";
import { verificationTokensTable } from "./schema/verification-tokens";
import { vocabWordsRelations, vocabWordsTable } from "./schema/vocab-words";
import { createClient, type Client } from "@libsql/client";
import { type SpanAttributes } from "@opentelemetry/api";
import { drizzle } from "drizzle-orm/libsql";
import { type Logger } from "drizzle-orm/logger";
import { env } from "~/env";

const schema = {
  // accounts
  accountsTable,
  accountsRelations,
  // chat_messages
  chatMessagesTable,
  chatMessagesRelations,
  // chats
  chatsTable,
  chatsRelations,
  // sessions
  sessionsTable,
  sessionsRelations,
  // user_profiles
  userProfilesTable,
  userProfilesRelations,
  // users
  usersTable,
  usersRelations,
  // verification
  verificationTokensTable, // doesn't have relations
  // vocabWords
  vocabWordsTable,
  vocabWordsRelations,
};

export type DBSchema = typeof schema;

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export let dbQueryContext: SpanAttributes = {};

class CustomLogger implements Logger {
  logQuery(query: string, params: unknown[]) {
    dbQueryContext = {
      "db.statement": query,
      "db.params": JSON.stringify(params),
      "db.orm.system": "drizzle",
      "db.orm.version": packageJson.dependencies["drizzle-orm"],
    };
  }
}

export const client =
  globalForDb.client ?? createClient({ url: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema, logger: new CustomLogger() });
