import type { Context as HonoContext } from "hono";
import type { auth } from "./auth";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  [key: string]: string;
}

export interface Variables {
  session: typeof auth.$Infer.Session.session | null;
  user?: typeof auth.$Infer.Session.user | null;
}

export type Context = HonoContext<{
  Bindings: Env;
  Variables: Variables;
}>;
