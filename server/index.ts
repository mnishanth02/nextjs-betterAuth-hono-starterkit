import type { Variables } from "@/types/server";
import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { errorHandler } from "./middleware/error.middleware";
import userRouter from "./routes/user.routes";

const API_BASE = process.env.API_BASE || "/api/v1";

// Create base app with types
const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(API_BASE);

// Global middleware
app.use("*", logger());
app.use("*", prettyJSON());

// CORS configuration
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
    credentials: true,
    maxAge: 86400,
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Mount routers
app.route("/user", userRouter);

// Error Handler
app.onError(errorHandler);

// Export for Next.js API routes
export type AppType = typeof app;
export { handle };
export default app;
