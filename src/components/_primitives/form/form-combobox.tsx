"use client";

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/_primitives/shadcn-raw/form";
import {
  Combobox,
  type ComboboxProps,
} from "~/components/_primitives/shadcn-raw/combobox";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ComboboxProps,
    Omit<ControllerProps<TFieldValues, TName>, "render" | "defaultValue"> {}

export function FormCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  disabled,
  name,
  options,
  placeholder,
  searchPlaceholder,
}: FormComboboxProps<TFieldValues, TName>) {
  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Language</FormLabel>
          <Combobox
            className="w-full"
            {...field}
            options={options}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
          />
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
