import type {
  CreateTodoInput,
  Todo,
  TodoResponse,
  UpdateTodoInput,
} from "@/features/todo/todo-types";
import type { ApiSuccessResponse } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "./server";

// Convert API response to our Todo type
export const mapToTodo = (response: TodoResponse): Todo => ({
  ...response,
  createdAt: new Date(response.createdAt),
  updatedAt: new Date(response.updatedAt),
});

// Query keys for todos - for consistent cache management
export const todoKeys = {
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
    queryFn: getTodos,
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
    queryFn: async () => await getTodoById(id || ""),
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
    mutationFn: async (json) => await createTodo(json),

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
    mutationFn: async (updateData) => await updateTodo(id || "", updateData),

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

  const mutation = useMutation<DeleteResponseType, Error, void, unknown>({
    mutationFn: async () => {
      const result = await deleteTodo(id || "");

      const formattedResponse: DeleteResponseType = {
        success: true,
        message: result.message || "Todo deleted successfully",
        data: result.data,
      };

      return formattedResponse;
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
