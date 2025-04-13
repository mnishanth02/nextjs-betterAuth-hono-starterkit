"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTodo } from "@/lib/api/todos";
import { useState } from "react";
import { toast } from "sonner";

export function TodoForm() {
  const [title, setTitle] = useState("");
  const createTodo = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Todo title cannot be empty");
      return;
    }

    createTodo.mutate(
      { title },
      {
        onSuccess: () => {
          setTitle("");
          // Toast is now handled in the API hook
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <Input
        type="text"
        placeholder="Add a new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={createTodo.isPending}
      />
      <Button type="submit" disabled={createTodo.isPending || !title.trim()}>
        Add
      </Button>
    </form>
  );
}
