"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DefaultValues,
  type UseFormProps,
  useForm,
} from "react-hook-form";
import { type ZodType } from "zod";

type NonNullableObject<T extends Record<string, any>> = Record<
  keyof T,
  NonNullable<T[keyof T]>
>;

/**
 * Compared to the normal `useForm`:
 *
 * - defaultValues are required (this is the important one)
 *   - the purpose of this is to get around a quirk in react-hook-form: an undefined
 *     value in the defaultValues makes the field start out as uncontrolled, which we
 *     don't want.
 *
 * - you just pass a schema instead of having to pass a resolver
 *
 * - don't need to pass a generic to the form, it gets inferred from the schema
 *   - you will still need to pass a generic to the `onSubmit` in most cases
 *
 * (feel free to use normal `useForm` if this doesn't work for something you're trying to do)
 */
export function useZodForm<TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver" | "defaultValues"> & {
    schema: TSchema;
    defaultValues: NonNullableObject<DefaultValues<TSchema["_input"]>>;
  },
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    // the casting here is _kind of_ a lie, but we're casting to a _less_ narrow
    // type than the actual input, so it's ok
    defaultValues: props.defaultValues as DefaultValues<TSchema["_input"]>,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}
