import * as React from "react";

import { cn } from "~/components/_utils/cn";

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "suffix"
  > {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, type, ...props }, ref) => {
    const needsWrapper = !!prefix || !!suffix;

    const inputNode = (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    if (!needsWrapper) {
      return inputNode;
    }

    // TODO: style these
    const prefixNode = prefix ? <span>{prefix}</span> : null;
    const suffixNode = suffix ? <span>{suffix}</span> : null;

    return (
      // TODO: style this
      <span>
        {prefixNode}
        {inputNode}
        {suffixNode}
      </span>
    );
  },
);
Input.displayName = "Input";

export { Input };
