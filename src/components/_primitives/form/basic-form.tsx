import { cn } from "~/components/_utils/cn";
import {
  type SubmitHandler,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

import { Form } from "~/components/_primitives/ui/form";

export type BasicFormProps<FormType extends FieldValues = FieldValues> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "children" | "onSubmit"
> & {
  buttons?: React.ReactNode;
  buttonsClassName?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  form: UseFormReturn<FormType>;
  onSubmit: SubmitHandler<FormType>;
};

/**
 * Note that unlike shadcn/ui, we here need to pass `form` as a specific prop instead of spreading it onto the component
 */
export function BasicForm<FormType extends FieldValues>(
  props: BasicFormProps<FormType>,
) {
  const {
    buttons,
    buttonsClassName,
    children,
    className,
    contentClassName,
    form,
    onSubmit,
    ...passthrough
  } = props;

  return (
    <Form {...form}>
      <form
        className={cn(
          // TODO: add styles
          className,
        )}
        onSubmit={form.handleSubmit(onSubmit)}
        {...passthrough}
      >
        <div
          // TODO: add styles
          className={cn(contentClassName)}
        >
          {children}
        </div>
        {buttons ? (
          <div
            className={cn(
              // TODO: add styles
              buttonsClassName,
            )}
          >
            {buttons}
          </div>
        ) : null}
      </form>
    </Form>
  );
}
