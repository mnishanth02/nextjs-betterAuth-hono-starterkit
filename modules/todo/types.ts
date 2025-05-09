import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
// export type Inputs = inferRouterInputs<AppRouter>;
export type TodosGetManyOutputs = inferRouterOutputs<AppRouter>["todos"]["getMany"];
