import { useState } from "react";
import { type JishoResult } from "unofficial-jisho-api";

type JishoDefinitionsProps = {
  word: string;
  jishoResults: JishoResult[];
};

export function JishoDefinitions({
  word,
  jishoResults,
}: JishoDefinitionsProps) {
  const [selectedResult, setSelectedResult] = useState(0);
  if (!jishoResults.length) return <p>No definition found for {word}</p>;
  return (
    <div className="overflow-y-scroll">
      {jishoResults.map((result, i) => (
        <JishoDefinition key={`jisho-definition-${i}`} jishoResult={result} />
      ))}
    </div>
  );
}

type JishoDefinitionProps = { jishoResult: JishoResult };

function JishoDefinition({ jishoResult }: JishoDefinitionProps) {
  return (
    <div>
      <p>{jishoResult.slug}</p>
      <div className="flex flex-col">
        {jishoResult.senses.map((sense, i) => (
          <div key={i}>
            <p>a{sense.english_definitions.join(", ")}A</p>
            <p>b{sense.parts_of_speech.join(", ")}B</p>
          </div>
        ))}
      </div>
    </div>
  );
}
