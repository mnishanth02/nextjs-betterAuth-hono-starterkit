"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

type RadioOption = {
  value: string;
  label: string;
  description?: string;
};

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
};

export function RadioGroupWithLabel<S>({
  fieldTitle,
  nameInSchema,
  options,
  className,
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{fieldTitle}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
              className="space-y-1"
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                    {option.description && (
                      <p className="text-muted-foreground text-sm">{option.description}</p>
                    )}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// <RadioGroupWithLabel
//   fieldTitle="Subscription Plan"
//   nameInSchema="plan"
//   options={[
//     { value: "free", label: "Free", description: "Basic features" },
//     { value: "pro", label: "Pro", description: "Advanced features" },
//   ]}
//   disabled={false}
// />
