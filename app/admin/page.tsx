import { auth } from "@/server/auth";
import { prefetch, trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminButton } from "./components/admin-button";
import TodoList from "./components/todo";

const AdminPage = async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData?.session) {
    redirect("/auth/sign-in");
  }

  void prefetch(trpc.todos.getMany.queryOptions());

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      AdminPage Welcome - {sessionData.user.name}
      <AdminButton />
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <TodoList />
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default AdminPage;
