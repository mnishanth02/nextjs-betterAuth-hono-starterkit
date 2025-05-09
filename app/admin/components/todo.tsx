"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const TodoList = () => {
  const trpc = useTRPC();
  const { data: todos } = useSuspenseQuery(trpc.todos.getMany.queryOptions());

  return (
    <div>
      <h1>TodoList</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
