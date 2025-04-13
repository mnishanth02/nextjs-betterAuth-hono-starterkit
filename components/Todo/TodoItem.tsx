"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteTodo, useUpdateTodo } from "@/lib/api/todos";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/todo";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTodo = useUpdateTodo(todo.id);
  const deleteTodo = useDeleteTodo(todo.id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggleComplete = () => {
    updateTodo.mutate(
      { completed: !todo.completed },
      {
        onSuccess: () => {
          // Toast is now handled in the API hook
        },
      }
    );
  };

  const handleDelete = () => {
    deleteTodo.mutate(undefined, {
      onSuccess: () => {
        // Toast is now handled in the API hook
      },
    });
  };

  const handleTitleUpdate = () => {
    if (title.trim() === "") return;
    if (title === todo.title) {
      setIsEditing(false);
      return;
    }

    updateTodo.mutate(
      { title },
      {
        onSuccess: () => {
          setIsEditing(false);
          // Toast is now handled in the API hook
        },
        onError: () => {
          setTitle(todo.title);
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="group mb-2 flex items-center justify-between rounded-md border p-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          disabled={updateTodo.isPending}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="rounded border bg-background px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={(e) => e.key === "Enter" && handleTitleUpdate()}
          />
        ) : (
          <span
            className={cn("cursor-pointer", todo.completed && "text-muted-foreground line-through")}
            onClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        disabled={deleteTodo.isPending}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
