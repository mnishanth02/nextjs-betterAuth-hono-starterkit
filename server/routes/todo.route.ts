import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";

// Validation schemas with improved error messages and type refinements
const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title cannot be empty" })
    .max(100, { message: "Title must be 100 characters or less" })
    .trim(),
});

const updateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title cannot be empty" })
      .max(100, { message: "Title must be 100 characters or less" })
      .trim()
      .optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// ID parameter validation for route parameters
const idParamSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
});

// Create a new router instance with proper validation
const todosRouter = new Hono()
  .get("/", getTodos)
  .get("/:id", zValidator("param", idParamSchema), getTodoById)
  .post("/", zValidator("json", createTodoSchema), createTodo)
  .patch(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateTodoSchema),
    updateTodo
  )
  .delete("/:id", zValidator("param", idParamSchema), deleteTodo);

export default todosRouter;
