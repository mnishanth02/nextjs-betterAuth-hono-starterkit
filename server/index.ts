import type { Variables } from "@/types/server";
import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { protect } from "./middleware";
import { errorHandler } from "./middleware/error.middleware";

const API_BASE = process.env.API_BASE || "/api/v1";

// Create base app with types
const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(API_BASE);

// Global middleware
app.use("*", logger());
app.use("*", prettyJSON());

// CORS configuration (tightened for security)
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"], // Specify allowed origins (update for production)
    credentials: true,
    maxAge: 86400, // Cache preflight for 1 day
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Better-Auth - Handle all auth routes
// app.all("/auth/*", async (c) => {
//     return await auth.handler(c.req.raw);
// });

// Protected user routes
app.get("/user/me", protect, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

// Error Handler
app.onError(errorHandler);

// Export for Next.js API routes
export type AppType = typeof app;
export { handle };
export default app;
