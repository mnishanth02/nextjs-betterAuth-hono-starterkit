"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  description?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaWithLabel<S>({
  fieldTitle,
  nameInSchema,
  description,
  className,
  placeholder,
  disabled = false,
  rows = 4,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldTitle}</FormLabel>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn("resize-none", disabled && "cursor-not-allowed opacity-50", className)}
              disabled={disabled}
              rows={rows}
              {...props}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// <TextareaWithLabel
//   fieldTitle="Description"
//   nameInSchema="description"
//   description="Provide a detailed description"
//   placeholder="Enter your description here..."
//   rows={6}
// />
