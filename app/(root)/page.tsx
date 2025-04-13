import { TodoForm, TodoList } from "@/components/Todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm />
          <Suspense fallback={<TodoListSkeleton />}>
            <TodoList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function TodoListSkeleton() {
  return (
    <div className="space-y-2">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
    </div>
  );
}
