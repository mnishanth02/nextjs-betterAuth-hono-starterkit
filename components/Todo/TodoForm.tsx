"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateTodo } from "@/lib/api/todos";
import { type CreateTodoFormData, createTodoSchema } from "@/lib/validations/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputWithLabel } from "../custom/input-with-label";

export function TodoForm() {
  const { mutateAsync, isPending } = useCreateTodo();

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: CreateTodoFormData) => {
    await mutateAsync(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-6 flex gap-2">
        <InputWithLabel
          nameInSchema="title"
          placeholder="Add a new todo..."
          disabled={form.formState.isSubmitting || isPending}
        />
        <Button type="submit" disabled={form.formState.isSubmitting || isPending}>
          Add
        </Button>
      </form>
    </Form>
  );
}
