"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl } from "@/components/ui/form";
import { useDeleteTodo, useUpdateTodo } from "@/lib/api/todos";
import { cn } from "@/lib/utils";
import { type UpdateTodoFormData, updateTodoSchema } from "@/lib/validations/todo";
import type { Todo } from "@/types/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { memo, startTransition, useEffect, useState } from "react";
import { useOptimistic, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startOptimisticTransition] = useTransition();

  // Optimistic UI updates
  const [optimisticTodo, updateOptimisticTodo] = useOptimistic<Todo, Partial<Todo>>(
    todo,
    (state, update) => ({ ...state, ...update })
  );

  // API mutation hooks
  const { mutate: updateTodoMutate, isPending: updateMutatePending } = useUpdateTodo(todo.id);
  const { mutate: deleteMutate, isPending: deleteMutatePending } = useDeleteTodo(todo.id);

  // React Hook Form setup
  const form = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: optimisticTodo.title,
    },
  });

  // Update form values when todo changes
  useEffect(() => {
    form.reset({ title: optimisticTodo.title });
  }, [form, optimisticTodo.title]);

  useEffect(() => {
    if (isEditing) {
      const timeout = setTimeout(() => {
        const inputElement = document.querySelector('input[name="title"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isEditing]);

  const handleToggleComplete = () => {
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
  };

  const handleDelete = () => {
    deleteMutate(undefined);
  };

  const onSubmit = (values: UpdateTodoFormData) => {
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
  };

  return (
    <div className="group mb-2 flex items-center justify-between rounded-md border p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={optimisticTodo.completed}
          onCheckedChange={handleToggleComplete}
          disabled={updateMutatePending || isPending}
        />

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormControl>
                <Input
                  type="text"
                  {...form.register("title")}
                  onBlur={form.handleSubmit(onSubmit)}
                  onKeyDown={(e) => e.key === "Enter" && form.handleSubmit(onSubmit)()}
                  disabled={isPending}
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
            onClick={() => setIsEditing(true)}
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
        disabled={deleteMutatePending || isPending}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
});
