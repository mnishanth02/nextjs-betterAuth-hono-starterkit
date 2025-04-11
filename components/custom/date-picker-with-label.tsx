"use client";

import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatUTCForDisplay, parseDateToUTC } from "@/lib/utils/date";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function DatePickerWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  disabled = false,
  placeholder = "Pick a date",
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTitle}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                  disabled={disabled}
                >
                  {field.value ? (
                    formatUTCForDisplay(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    // Convert the selected date to UTC before storing
                    const utcDate = parseDateToUTC(date.toISOString());
                    field.onChange(utcDate);
                  } else {
                    field.onChange("");
                  }
                }}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
