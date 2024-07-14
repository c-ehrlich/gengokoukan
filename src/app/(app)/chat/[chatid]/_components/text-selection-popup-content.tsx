"use client";

import { JishoDefinitions } from "./jisho-definition";
import { api } from "~/trpc/react";

export function TextSelectionPopupContent({
  selectedText,
}: {
  selectedText?: string;
}) {
  const definition = api.jisho.getDefinition.useQuery(
    {
      word: selectedText ?? "",
    },
    { enabled: !!selectedText, staleTime: Infinity },
  );

  return (
    <div className="flex min-h-full w-full flex-col justify-between gap-4">
      {selectedText && (
        <>
          {selectedText && definition.isPending ? (
            <p>Loading definition...</p>
          ) : definition.isError ? (
            <p>{JSON.stringify(definition.error)}</p>
          ) : (
            <JishoDefinitions
              word={selectedText}
              // TODO: fix assertion
              jishoResults={definition.data!}
            />
          )}
        </>
      )}
    </div>
  );
}
