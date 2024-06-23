import React from "react";
import {
  type FieldValues,
  type FieldPath,
  type ControllerProps,
} from "react-hook-form";

import { Input as BaseInput } from "~/components/_primitives/shadcn-raw/input";
import {
  FormField,
  FormControl,
} from "~/components/_primitives/shadcn-raw/form";

import { FormItem } from "~/components/_primitives/form/form-item";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render" | "defaultValue">,
    Omit<
      InputProps,
      "name" | "required" | "value" | "hasError" | "onChange" | "onBlur"
    > {
  inputRef?: React.Ref<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  rootClassName?: string;
  required?: boolean;
}

/**
 * This wraps around `Input`
 * `Input` is below this in the file, because it makes assumptions about being inside a controlled form
 * (it uses `useFormField` to get the error)
 *
 * TODO: If you need `Input` outside a react-hook-form, maybe break out the hook into a separate component,
 * which then calls a more reusable / library agnostic `Input` component.
 */

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormInputProps<TFieldValues, TName>) {
  const {
    rootClassName,
    control,
    inputRef,
    label,
    name,
    placeholder,
    required,
    ...passthrough
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      key={name}
      render={({ field }) => (
        <FormItem className={rootClassName} label={label} required={required}>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              ref={inputRef}
              {...passthrough}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  expand?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  wrap?: boolean;
  wrapClassName?: string;
}

/**
 * Only use this on its own when you're not in a form context
 * you can pass `hasError` manually if the component is not getting its error state from context
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { ...passthrough } = props;

    return <BaseInput {...passthrough} ref={ref} />;
  },
);

Input.displayName = "Input";
