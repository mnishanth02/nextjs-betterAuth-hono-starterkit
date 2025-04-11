"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

type SelectOption = {
  value: string;
  label: string;
};

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

export function SelectWithLabel<S>({
  fieldTitle,
  nameInSchema,
  options,
  placeholder = "Select an option",
  className,
  isLoading = false,
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={nameInSchema}>{fieldTitle}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
            disabled={isLoading || disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  className,
                  "w-full cursor-pointer",
                  (isLoading || disabled) && "cursor-not-allowed opacity-50"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.length === 0 ? (
                <SelectItem value="no-options" disabled>
                  No options available
                </SelectItem>
              ) : (
                options.map((option) => (
                  <SelectItem className="cursor-pointer" key={option.value} value={option.value}>
                    {option.label.charAt(0).toUpperCase() + option.label.toLowerCase().slice(1)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
