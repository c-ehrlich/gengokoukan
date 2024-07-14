import { type Config } from "drizzle-kit";
import { env } from "~/env";
import { sqlTablePrefix } from "~/server/db/create-table";

export default {
  schema: "./src/server/db/schema/_root.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/server/db/_migrations",
  tablesFilter: [`${sqlTablePrefix}_*`],
} satisfies Config;
