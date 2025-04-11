"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  description,
  className,
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 p-4", className)}>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {fieldTitle}
            </FormLabel>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// <CheckboxWithLabel
//   fieldTitle="Accept terms"
//   nameInSchema="acceptTerms"
//   description="I agree to the terms and conditions"
//   disabled={false}
// />
