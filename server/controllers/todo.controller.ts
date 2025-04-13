import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todo";
import type { Context } from "hono";

// In-memory todos for demonstration
// In a real app, you'd use a database
let todos: Todo[] = [
  {
    id: "1",
    title: "Learn Next.js",
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Learn Hono",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * @api {get} /todos Get All Todos
 * @apiGroup Todos
 * @access Public
 */
export const getTodos = async (c: Context) => {
  return c.json(todos);
};

/**
 * @api {get} /todos/:id Get Single Todo
 * @apiGroup Todos
 * @access Public
 */
export const getTodoById = async (c: Context) => {
  const id = c.req.param("id");
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  return c.json(todo);
};

/**
 * @api {post} /todos Create Todo
 * @apiGroup Todos
 * @access Public
 */
export const createTodo = async (c: Context) => {
  // The validation is done in the route with zValidator
  const body = (await c.req.json()) as CreateTodoInput;
  const newTodo: Todo = {
    id: String(Date.now()),
    title: body.title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);
  return c.json(newTodo, 201);
};

/**
 * @api {patch} /todos/:id Update Todo
 * @apiGroup Todos
 * @access Public
 */
export const updateTodo = async (c: Context) => {
  const id = c.req.param("id");
  // The validation is done in the route with zValidator
  const body = (await c.req.json()) as UpdateTodoInput;
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  const currentTodo = todos[todoIndex] as Todo;

  const updatedTodo: Todo = {
    id: currentTodo.id,
    title: body.title !== undefined ? body.title : currentTodo.title,
    completed: body.completed !== undefined ? body.completed : currentTodo.completed,
    createdAt: currentTodo.createdAt,
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;

  return c.json(updatedTodo);
};

/**
 * @api {delete} /todos/:id Delete Todo
 * @apiGroup Todos
 * @access Public
 */
export const deleteTodo = async (c: Context) => {
  const id = c.req.param("id");
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  const deletedTodo = todos[todoIndex];
  todos = todos.filter((t) => t.id !== id);

  return c.json(deletedTodo);
};
