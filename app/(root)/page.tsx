import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodos } from "@/features/todo/api/server";
import { todoKeys } from "@/features/todo/api/todos";
import { TodoList } from "@/features/todo/components";
import { TodoForm } from "@/features/todo/components/todo-form";
import { getQueryClient } from "@/lib/utils/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: todoKeys.all,
    queryFn: getTodos,
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TodoList />
          </HydrationBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
