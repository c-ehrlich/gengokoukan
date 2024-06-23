import React, { Fragment, useId } from "react";
import { type FieldError } from "react-hook-form";

import {
  FormItemContext,
  useFormField,
} from "~/components/_primitives/shadcn-raw/form";

import { FormLabel } from "~/components/_primitives/form/form-label";
import { getErrorString } from "~/components/_utils/error";

export interface FormItemProps {
  className?: string;
  formLabelId?: string;
  helperText?: React.ReactNode;
  horizontal?: boolean;
  itemClassName?: string;
  label?: string;
  labelClassName?: string;
  labelFor?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export function FormItem(props: FormItemProps) {
  const { children, className, ...passthrough } = props;

  const { error, formMessageId } = useFormField();

  const id = useId();

  return (
    <FormItemContext.Provider value={{ id: id }}>
      <FormItemVanilla
        className={className}
        error={error}
        formMessageId={formMessageId}
        {...passthrough}
      >
        {children}
      </FormItemVanilla>
    </FormItemContext.Provider>
  );
}

interface FormItemVanillaProps extends FormItemProps {
  error?: FieldError | string;
  formMessageId?: string;
}

/**
 * Extracted version of FormField that doesn't require being inside a hook-form.
 */
export function FormItemVanilla(props: FormItemVanillaProps) {
  const {
    children,
    className,
    error,
    formLabelId,
    itemClassName,
    label,
    labelClassName,
    labelFor,
    required,
    helperText,
  } = props;

  return (
    <Fragment>
      <div className={className}>
        {label ? (
          <FormLabel
            id={formLabelId}
            htmlFor={labelFor}
            className={labelClassName}
          >
            {required ? "* " : null}
            {label}
          </FormLabel>
        ) : null}
        <div className={itemClassName}>{children}</div>
        {/* TODO: style these */}
        {error ? (
          <span className="text-red-500">{getErrorString(error)}</span>
        ) : helperText ? (
          <span>{helperText}</span>
        ) : null}
      </div>
    </Fragment>
  );
}
