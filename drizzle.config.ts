import { type Config } from "drizzle-kit";
import { sqlTablePrefix } from "~/server/db/create-table";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema/_root.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: [`${sqlTablePrefix}_*`],
} satisfies Config;
