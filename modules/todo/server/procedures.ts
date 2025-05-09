import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const todoRouter = createTRPCRouter({
  getMany: baseProcedure.query(() => {
    return [
      {
        id: 1,
        text: "Todo 1",
      },
      {
        id: 2,
        text: "Todo 2",
      },
    ];
  }),
});
