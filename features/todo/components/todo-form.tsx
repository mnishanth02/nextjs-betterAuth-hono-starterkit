"use client";

import { InputWithLabel } from "@/components/custom/input-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateTodo } from "@/features/todo/api/todos";
import { type CreateTodoFormData, createTodoSchema } from "@/lib/validations/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TodoForm() {
  const { mutateAsync, isPending } = useCreateTodo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = isPending || isSubmitting;

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = useCallback(
    async (values: CreateTodoFormData) => {
      if (!values.title.trim()) return;

      setIsSubmitting(true);
      try {
        await mutateAsync(values);
        form.reset();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? `Failed to create todo: ${error.message}`
            : "An unexpected error occurred"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, mutateAsync]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-6 flex gap-2"
        aria-label="Create new todo form"
      >
        <InputWithLabel
          nameInSchema="title"
          placeholder="Add a new todo..."
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          aria-label="Todo title"
        />
        <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}
