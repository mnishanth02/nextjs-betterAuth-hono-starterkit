import { env } from "@/env/server-env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);

const db = drizzle({ client: sql, schema });

export { db };
