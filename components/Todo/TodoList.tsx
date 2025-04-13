"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetTodos } from "@/lib/api/todos";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const { data: todos, isLoading, error } = useGetTodos();

  if (isLoading) {
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

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load todos</p>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No todos found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
