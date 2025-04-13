import { handle } from "hono/vercel";

import app from "@/server";
import todosRoutes from "@/server/routes/todo.route";
import userRouter from "@/server/routes/user.route";

export const runtime = "edge";

const routes = app.route("/user", userRouter).route("/todos", todosRoutes);

//

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
