import { type VariantProps, cva } from "class-variance-authority";
import React, { type HTMLAttributes } from "react";
import { cn } from "~/components/_utils/cn";

const headerVariants = cva("font-semibold", {
  variants: {
    variant: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-3xl",
      h4: "text-2xl",
      h5: "text-xl",
      h6: "text-lg",
    },
  },
});

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant: NonNullable<VariantProps<typeof headerVariants>["variant"]>;
}

export function Header({ variant, className, children }: HeaderProps) {
  return React.createElement(
    variant,
    { className: cn(headerVariants({ variant }), className) },
    children,
  );
}
