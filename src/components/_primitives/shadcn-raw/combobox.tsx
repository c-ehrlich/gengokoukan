"use client";

import React, { useMemo } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "~/components/_utils/cn";

export type OptionWithoutHeading = { value: string; label: string };
export type OptionWithHeading = {
  heading: string;
  value: string;
  label: string;
};

export type ComboboxProps = {
  className?: string;
  options: Array<OptionWithoutHeading> | Array<OptionWithHeading>;
  placeholder: string;
  emptyValue?: string;
  searchPlaceholder: string;
};

export function Combobox({
  className,
  options,
  placeholder,
  emptyValue,
  searchPlaceholder,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const optionsList = useMemo(() => {
    if (!options[0]) return null;

    const hasHeadings = "heading" in options[0];

    if (!hasHeadings) {
      return (
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
            >
              {option.label}
              <CheckIcon
                className={cn(
                  "ml-auto h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0",
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      );
    }

    // @ts-expect-error shut up
    const optionsGroupedByHeading: Array<{
      heading: string;
      options: Array<OptionWithHeading>;
    }> = options.reduce(
      // @ts-expect-error shut up
      (acc, option: OptionWithHeading) => {
        const existingHeading = acc.find(
          (group) => group.heading === option.heading,
        );

        if (!existingHeading) {
          acc.push({
            heading: option.heading,
            options: [option],
          });
        } else {
          existingHeading.options.push(option);
        }

        return acc;
      },
      [] as Array<{ heading: string; options: Array<OptionWithHeading> }>,
    );

    return (
      <>
        {optionsGroupedByHeading.map((option) => (
          <CommandGroup
            key={option.heading}
            heading={option.heading}
            className="border-b"
          >
            {option.options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {option.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </>
    );
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="combobox"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9 w-full"
          />
          <CommandList>
            <CommandEmpty>{emptyValue ?? "No results found"}</CommandEmpty>
            {optionsList}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
