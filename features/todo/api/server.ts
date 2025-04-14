import { client } from "@/lib/hono-client";
import type { CreateTodoInput, UpdateTodoInput } from "../todo-types";
import { mapToTodo } from "./todos";

export const getTodos = async () => {
  const response = await client.api.todos.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  return (await response.json()).map(mapToTodo);
};

export const getTodoById = async (id: string) => {
  const response = await client.api.todos[":id"].$get({
    param: { id },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch todo");
  }

  return mapToTodo(await response.json());
};

export const createTodo = async (todo: CreateTodoInput) => {
  const response = await client.api.todos.$post({
    json: todo,
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return mapToTodo(await response.json());
};

export const updateTodo = async (id: string, todo: UpdateTodoInput) => {
  const response = await client.api.todos[":id"].$patch({
    param: { id },
    json: todo,
  } as {
    param: { id: string };
    json: UpdateTodoInput;
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }

  return mapToTodo((await response.json()).data);
};

export const deleteTodo = async (id: string) => {
  const response = await client.api.todos[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }

  return await response.json();
};
