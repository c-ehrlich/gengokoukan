import React from "react";
import { cn } from "~/components/_utils/cn";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  // variant?: FormLabelVariant;
}

export const FormLabel = ({
  className,
  // TODO: variant
  ...passthrough
}: FormLabelProps) => {
  const Component = passthrough.htmlFor ? "label" : "span";

  return <Component className={cn(className)} {...passthrough} />;
};
