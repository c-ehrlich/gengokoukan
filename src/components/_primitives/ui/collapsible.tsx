"use client";

import { Button } from "../shadcn-raw/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn-raw/collapsible";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import { cn } from "~/components/_utils/cn";

type CollapsibleProps = {
  trigger: React.ReactNode;
  alwaysVisibleContent?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function BasicCollapsible({
  alwaysVisibleContent,
  children,
  defaultOpen,
  trigger,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <h4
          className="w-full text-sm font-semibold"
          onClick={() => setOpen((o) => !o)}
        >
          {trigger}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {alwaysVisibleContent && (
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          {alwaysVisibleContent}
        </div>
      )}
      <CollapsibleContent
        className={cn(
          "space-y-2",
          "CollapsibleContent", // shadcn collapsible animation
        )}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
