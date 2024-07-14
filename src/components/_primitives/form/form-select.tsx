import { FormControl, FormField } from "../shadcn-raw/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../shadcn-raw/select";
import { SelectItem } from "../shadcn-raw/select";
import { FormItem } from "./form-item";
import {
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export const FormSelectOption = SelectItem;

interface TriggerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render" | "defaultValue">,
    Omit<React.ComponentPropsWithoutRef<typeof SelectTrigger>, "name"> {}
// TODO: Igor duct taped this together, some props are probably missing, being passed to the wrong component or wrong. I think we should revisit how we expose this since Radix asks us to compose multiple React components to build a Select, while this surfaces only a single set of props. IMO we should allow the consumer to compose their own Select... - igor

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render" | "defaultValue">,
    Omit<
      React.ComponentPropsWithoutRef<typeof Select>,
      "name" | "onValueChange"
    > {
  children?: React.ReactNode;
  rootClassName?: string;
  label?: string; // TODO: is optional ok for this?
  helperText?: string;
  onBlur?: TriggerProps["onBlur"]; // TODO: is optional ok for this?
  placeholder?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  rootClassName,
  children,
  label,
  name,
  onBlur,
  placeholder,
  required,
  ...passthrough
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={rootClassName}
          label={label}
          labelFor={name}
          required={required}
        >
          <Select
            {...passthrough}
            // type="axi-default"
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger onBlur={onBlur} id={name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{children}</SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
