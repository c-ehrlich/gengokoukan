import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn-raw/tooltip";

type BasicTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};
export function BasicTooltip({ children, content }: BasicTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="w-96 max-w-[calc(100vw-64px)]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
