import { authRouter } from "@/modules/auth/server/procedure";
import { todoRouter } from "@/modules/todo/server/procedures";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  todos: todoRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
