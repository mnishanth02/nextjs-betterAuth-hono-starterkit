import { type Config, defineConfig } from "drizzle-kit";
import { env } from "./env/server-env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema",
  out: "./server/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
    // ssl: false
  },
  verbose: true,
  strict: true,
} satisfies Config);
