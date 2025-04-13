import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono-client";
import type { ApiSuccessResponse } from "@/types/api";
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

/**
 * Extract error message from API response
 */
const extractErrorMessage = (errorData: unknown, fallbackMessage: string): string => {
  if (!errorData) return fallbackMessage;

  // Handle our API error format
  if (typeof errorData === "object" && errorData !== null) {
    if ("error" in errorData && typeof errorData.error === "string") return errorData.error;
    if ("message" in errorData && typeof errorData.message === "string") return errorData.message;
  }

  return fallbackMessage;
};

/**
 * Standardized API error handler
 */
const handleApiError = (error: unknown, fallbackMessage: string): never => {
  console.error(fallbackMessage, error);

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(fallbackMessage);
};

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
          const errorData = await response.json().catch(() => null);
          const errorMessage = extractErrorMessage(
            errorData,
            `Failed to fetch todos: ${response.status}`
          );
          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (error) {
        return handleApiError(error, "Error fetching todos");
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
          const errorData = await response.json().catch(() => null);
          const errorMessage = extractErrorMessage(
            errorData,
            `Failed to fetch todo: ${response.status}`
          );
          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (error) {
        return handleApiError(error, "Error fetching todo");
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

        const res = await response.json();
        return mapToTodo(res);
      } catch (error) {
        return handleApiError(error, "Error creating todo");
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

        const res = await response.json();
        return mapToTodo(res.data);
      } catch (error) {
        return handleApiError(error, "Error updating todo");
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

  type DeleteResponseType = ApiSuccessResponse<{ id: string }>;

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

        return await response.json();
      } catch (error) {
        return handleApiError(error, "Error deleting todo");
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
