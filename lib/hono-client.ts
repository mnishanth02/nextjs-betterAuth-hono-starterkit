import type { AppType } from "@/app/api/[[...route]]/route";
import { env } from "@/env/client-env";
import { hc } from "hono/client";

const BASE_URL = `${env.NEXT_PUBLIC_SERVER_URL}` || "http://localhost:3000";

export const client = hc<AppType>(BASE_URL);
