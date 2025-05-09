import { auth } from "@/server/auth";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers } from "next/headers";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  }),
});
