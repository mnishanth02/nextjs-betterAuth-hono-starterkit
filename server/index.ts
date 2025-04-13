import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { errorHandler } from "./middleware/error.middleware";

const API_BASE = "/api";

const app = new Hono().basePath(API_BASE);

app.use("*", logger());
app.use("*", prettyJSON());

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
    credentials: true,
    maxAge: 86400,
  })
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.onError(errorHandler);

export default app;
