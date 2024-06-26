import React from "react";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormControl, FormField } from "../shadcn-raw/form";
import { TextArea, type TextAreaProps } from "../shadcn-raw/textarea";

import { FormItem } from "./form-item";

interface FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render" | "defaultValue">,
    Omit<TextAreaProps, "name"> {
  helperClassName?: string;
  horizontal?: boolean;
  label?: string;
  placeholder?: string;
  rootClassName?: string;
}

export function FormTextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormTextAreaProps<TFieldValues, TName>) {
  const {
    control,
    horizontal,
    label,
    name,
    placeholder,
    required,
    rootClassName,
    ...passthrough
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      key={name}
      render={({ field }) => (
        <FormItem
          className={rootClassName}
          horizontal={horizontal}
          label={label}
          required={required}
        >
          <FormControl>
            <TextArea {...field} placeholder={placeholder} {...passthrough} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
