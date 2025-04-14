"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDeleteTodo, useUpdateTodo } from "@/features/todo/api/todos";
import { cn } from "@/lib/utils";
import { type UpdateTodoFormData, updateTodoSchema } from "@/lib/validations/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { memo, startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useOptimistic, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { Todo } from "../todo-types";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startOptimisticTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimistic UI updates
  const [optimisticTodo, updateOptimisticTodo] = useOptimistic<Todo, Partial<Todo>>(
    todo,
    (state, update) => ({ ...state, ...update })
  );

  // API mutation hooks
  const { mutate: updateTodoMutate, isPending: updateMutatePending } = useUpdateTodo(todo.id);
  const { mutate: deleteMutate, isPending: deleteMutatePending } = useDeleteTodo(todo.id);
  const isLoading = isPending || updateMutatePending || deleteMutatePending;

  // React Hook Form setup
  const form = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: optimisticTodo.title,
    },
  });

  // Update form values when todo changes or when editing starts
  useEffect(() => {
    if (isEditing || todo.title !== form.getValues().title) {
      form.reset({ title: optimisticTodo.title });
    }
  }, [form, optimisticTodo.title, isEditing, todo.title]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isEditing]);

  const handleToggleComplete = useCallback(() => {
    startOptimisticTransition(() => {
      // Apply optimistic update inside transition
      updateOptimisticTodo({ completed: !optimisticTodo.completed });

      // Then perform the actual API call
      updateTodoMutate(
        { completed: !optimisticTodo.completed },
        {
          onError: () => {
            // Revert optimistic update on error
            startTransition(() => {
              updateOptimisticTodo({ completed: optimisticTodo.completed });
            });
          },
        }
      );
    });
  }, [optimisticTodo.completed, updateOptimisticTodo, updateTodoMutate]);

  const handleDelete = useCallback(() => {
    deleteMutate(undefined);
  }, [deleteMutate]);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditSubmit = useCallback(
    (values: UpdateTodoFormData) => {
      if (!values.title?.trim()) return;
      if (values.title === optimisticTodo.title) {
        setIsEditing(false);
        return;
      }

      startOptimisticTransition(() => {
        // Apply optimistic update inside transition
        updateOptimisticTodo({ title: values.title });

        // Then perform the actual API call
        updateTodoMutate(
          { title: values.title },
          {
            onSuccess: () => {
              setIsEditing(false);
            },
            onError: () => {
              // Revert optimistic update on error
              startTransition(() => {
                updateOptimisticTodo({ title: optimisticTodo.title });
                form.reset({ title: optimisticTodo.title });
                setIsEditing(false);
              });
            },
          }
        );
      });
    },
    [form, optimisticTodo.title, updateOptimisticTodo, updateTodoMutate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        form.handleSubmit(handleEditSubmit)();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        form.reset({ title: optimisticTodo.title });
      }
    },
    [form, handleEditSubmit, optimisticTodo.title]
  );

  return (
    <div className="group mb-2 flex items-center justify-between rounded-md border p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={optimisticTodo.completed}
          onCheckedChange={handleToggleComplete}
          disabled={isLoading}
          aria-label={`Mark "${optimisticTodo.title}" as ${optimisticTodo.completed ? "incomplete" : "complete"}`}
        />

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} aria-label="Edit todo form">
              <FormControl>
                <Input
                  type="text"
                  {...form.register("title")}
                  ref={(e) => {
                    // This merges our ref with React Hook Form's ref
                    inputRef.current = e;
                    const { ref } = form.register("title");
                    if (typeof ref === "function") {
                      ref(e);
                    }
                  }}
                  onBlur={form.handleSubmit(handleEditSubmit)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  aria-label="Edit todo title"
                  defaultValue={optimisticTodo.title}
                />
              </FormControl>
            </form>
          </Form>
        ) : (
          <span
            className={cn(
              "cursor-pointer",
              optimisticTodo.completed && "text-muted-foreground line-through"
            )}
            onClick={handleEditStart}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleEditStart()}
            aria-label="Edit todo"
          >
            {optimisticTodo.title}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        disabled={isLoading}
        aria-label="Delete todo"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
});
