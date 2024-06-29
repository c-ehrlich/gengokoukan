import React, { forwardRef } from "react";
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

export const FormTextArea = forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    props: FormTextAreaProps<TFieldValues, TName>,
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
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

    console.log("tktk FormTextArea passthrough", passthrough);

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
              <TextArea
                {...field}
                ref={ref}
                placeholder={placeholder}
                {...passthrough}
              />
            </FormControl>
          </FormItem>
        )}
      />
    );
  },
);

// @ts-expect-error forwardRef hack
FormTextArea.displayName = "FormTextArea";
