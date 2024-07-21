import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn-raw/tooltip";
import React from "react";

type BasicTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};
export function BasicTooltip({ children, content }: BasicTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-[max(400px, calc(100vw-64px))] w-auto shadow-xl">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type MaybeBasicTooltipProps = BasicTooltipProps & {
  enabled?: boolean;
};
export function MaybeBasicTooltip({
  children,
  content,
  enabled,
}: MaybeBasicTooltipProps) {
  if (!enabled) {
    return children;
  }

  return <BasicTooltip content={content}>{children}</BasicTooltip>;
}
