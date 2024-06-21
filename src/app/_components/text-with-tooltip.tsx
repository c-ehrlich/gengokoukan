"use client";

import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { JishoDefinition, JishoDefinitions } from "./jisho-definition";

export const TextWithTooltip = ({ text }: { text: string }) => {
  const [selectedText, setSelectedText] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="flex h-full w-full flex-1">
      <SelectableText text={text} setSelectedText={setSelectedText} />
      <SelectedTextSidebar selectedText={selectedText} />
    </div>
  );
};

function useTextSelection({
  setSelectedText,
  textContainerRef,
}: {
  setSelectedText: (text: string) => void;
  textContainerRef: React.RefObject<HTMLDivElement>;
}) {
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();

      if (selection && selection.toString().trim() !== "") {
        const range = selection.getRangeAt(0);
        const container = textContainerRef.current;
        if (container?.contains(range.commonAncestorContainer)) {
          setSelectedText(selection.toString());
        }
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setSelectedText, textContainerRef]);
}

function SelectableText({
  text,
  setSelectedText,
}: {
  text: string;
  setSelectedText: (text: string) => void;
}) {
  const splitText = text.split("\\n").filter(Boolean);
  console.log(text, splitText);
  const textContainerRef = React.useRef<HTMLDivElement>(null);

  useTextSelection({ setSelectedText, textContainerRef });

  return (
    <div
      ref={textContainerRef}
      className="flex h-full flex-1 flex-col gap-2 p-2"
    >
      {splitText.map((line, idx) => (
        <p key={`text-line-${idx + 1}`}>{line}</p>
      ))}
    </div>
  );
}

function SelectedTextSidebar({ selectedText }: { selectedText?: string }) {
  const handleButtonClick = () => {
    if (selectedText) {
      console.log(selectedText);
    }
  };

  const definition = api.jisho.definition.useQuery(
    {
      word: selectedText ?? "",
    },
    { enabled: !!selectedText },
  );

  return (
    <div className="flex min-h-full w-64 flex-col justify-between gap-4 bg-green-200 p-2 text-black">
      {selectedText && (
        <>
          <p>{selectedText}</p>
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
          {selectedText && (
            <button className="bg-red-500 p-2" onClick={handleButtonClick}>
              Log Text
            </button>
          )}
        </>
      )}
    </div>
  );
}
