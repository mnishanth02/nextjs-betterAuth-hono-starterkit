import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@/lib/hono-client";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types/todo";

// Response type from API differs from our internal Todo type (Date vs string)
interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Patch request params type
interface TodoPatchRequest {
  param: { id: string };
  json: UpdateTodoInput;
}

// Zod schema for validating API responses
const todoResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const todoArrayResponseSchema = z.array(todoResponseSchema);

const errorResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
});

// Convert API response to our Todo type
const mapToTodo = (response: TodoResponse): Todo => ({
  ...response,
  createdAt: new Date(response.createdAt),
  updatedAt: new Date(response.updatedAt),
});

// Query keys for todos - for consistent cache management
const todoKeys = {
  all: ["todos"] as const,
  detail: (id: string) => ["todos", { id }] as const,
};

/**
 * Helper function to extract error message from API response
 */
const extractErrorMessage = (errorData: unknown, defaultMessage: string): string => {
  if (!errorData) return defaultMessage;

  const result = errorResponseSchema.safeParse(errorData);
  if (result.success && result.data.message) {
    return result.data.message;
  }

  return defaultMessage;
};

/**
 * Hook to fetch all todos
 * @returns Query result with todos data, loading and error states
 */
export const useGetTodos = () => {
  const query = useQuery({
    queryKey: todoKeys.all,
    queryFn: async () => {
      try {
        const response = await client.api.todos.$get();

        if (!response.ok) {
          throw new Error(`Failed to fetch todos: ${response.status}`);
        }

        const result = await response.json();
        // Validate the response against our schema
        return todoArrayResponseSchema.parse(result);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Response validation error:", error.format());
          throw new Error("Invalid response format from server");
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error fetching todos: ${errorMessage}`);
        throw error;
      }
    },
    select: (data) => data.map(mapToTodo),
  });

  return query;
};

/**
 * Hook to fetch a single todo by ID
 * @param id The todo ID to fetch
 * @returns Query result with todo data, loading and error states
 */
export const useGetTodoById = (id?: string) => {
  const query = useQuery({
    enabled: Boolean(id),
    queryKey: todoKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("Todo ID is required");
      }

      try {
        const response = await client.api.todos[":id"].$get({
          param: { id },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch todo: ${response.status}`);
        }

        const result = await response.json();
        // Validate the response against our schema
        return todoResponseSchema.parse(result);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Response validation error:", error.format());
          throw new Error("Invalid response format from server");
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error fetching todo: ${errorMessage}`);
        throw error;
      }
    },
    select: (data) => mapToTodo(data),
  });

  return query;
};

/**
 * Hook to create a new todo
 * @returns Mutation for creating todos
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  type ResponseType = Todo;
  type RequestType = CreateTodoInput;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      try {
        const response = await client.api.todos.$post({ json });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = extractErrorMessage(
            errorData,
            `Failed to create todo: ${response.status}`
          );
          throw new Error(errorMessage);
        }

        const result = await response.json();
        // Validate the response against our schema
        const validatedResponse = todoResponseSchema.parse(result);
        return mapToTodo(validatedResponse);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Response validation error:", error.format());
          throw new Error("Invalid response format from server");
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error creating todo: ${errorMessage}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Todo created successfully");
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onError: (error) => {
      console.error("Create todo error:", error);
      toast.error(`Failed to create todo: ${error.message}`);
    },
  });

  return mutation;
};

/**
 * Hook to update an existing todo
 * @param id The todo ID to update
 * @returns Mutation for updating todos
 */
export const useUpdateTodo = (id?: string) => {
  const queryClient = useQueryClient();

  type ResponseType = Todo;
  type RequestType = UpdateTodoInput;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (updateData) => {
      if (!id) {
        throw new Error("Todo ID is required");
      }

      try {
        // Create a properly typed request object
        const requestParams: TodoPatchRequest = {
          param: { id },
          json: updateData,
        };

        // We need to cast the type because TypeScript doesn't know about Hono's
        // combined param + json structure
        const response = await client.api.todos[":id"].$patch(
          requestParams as unknown as { param: { id: string } }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = extractErrorMessage(
            errorData,
            `Failed to update todo: ${response.status}`
          );
          throw new Error(errorMessage);
        }

        const result = await response.json();
        // Validate the response against our schema
        const validatedResponse = todoResponseSchema.parse(result);
        return mapToTodo(validatedResponse);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Response validation error:", error.format());
          throw new Error("Invalid response format from server");
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error updating todo: ${errorMessage}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Todo updated successfully");
      if (id) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onError: (error) => {
      console.error("Update todo error:", error);
      toast.error(`Failed to update todo: ${error.message}`);
    },
  });

  return mutation;
};

/**
 * Hook to delete a todo
 * @param id The todo ID to delete
 * @returns Mutation for deleting todos
 */
export const useDeleteTodo = (id?: string) => {
  const queryClient = useQueryClient();

  // Schema for delete response
  const deleteResponseSchema = z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
  });

  type DeleteResponseType = z.infer<typeof deleteResponseSchema>;

  const mutation = useMutation<DeleteResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Todo ID is required");
      }

      try {
        const response = await client.api.todos[":id"]["$delete"]({
          param: { id },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = extractErrorMessage(
            errorData,
            `Failed to delete todo: ${response.status}`
          );
          throw new Error(errorMessage);
        }

        const result = await response.json();
        // Validate the response against our schema
        return deleteResponseSchema.parse(result);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Response validation error:", error.format());
          throw new Error("Invalid response format from server");
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Error deleting todo: ${errorMessage}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Todo deleted successfully");
      if (id) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
    onError: (error) => {
      console.error("Delete todo error:", error);
      toast.error(`Failed to delete todo: ${error.message}`);
    },
  });

  return mutation;
};
