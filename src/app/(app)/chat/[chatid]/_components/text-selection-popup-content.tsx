import { api } from "~/trpc/react";
import { JishoDefinitions } from "./jisho-definition";

export function TextSelectionPopupContent({
  selectedText,
}: {
  selectedText?: string;
}) {
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
    <div className="flex min-h-full w-64 flex-col justify-between gap-4">
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
