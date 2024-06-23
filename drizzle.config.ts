import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema/_root.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["gengokoukan_*"],
} satisfies Config;
