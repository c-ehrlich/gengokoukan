import { useState } from "react";
import { type JishoResult } from "unofficial-jisho-api";

export function JishoDefinitions({
  word,
  jishoResults,
}: {
  word: string;
  jishoResults: JishoResult[];
}) {
  const [selectedResult, setSelectedResult] = useState(0);
  if (!jishoResults.length) return <p>No definition found for {word}</p>;
  return (
    <div>
      {jishoResults.map((result, i) => (
        <div key={`jisho-result-${i}`}>
          <p onClick={() => setSelectedResult(i)}>{result.slug}</p>
          {selectedResult === i && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
      ))}
    </div>
  );
}
