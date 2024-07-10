import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/_primitives/shadcn-raw/accordion";

export function LandingAccordion({
  items,
}: {
  items: Array<{ title: React.ReactNode; description: React.ReactNode }>;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>
            <div className="flex w-full items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-orange-500 bg-orange-300">
                <p
                  className="font-semibold text-black no-underline hover:!no-underline"
                  style={{ textDecoration: "none !important" }}
                >
                  {i + 1}
                </p>
              </div>
              <div className="w-full text-start text-2xl">{item.title}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-800">
            {item.description}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
