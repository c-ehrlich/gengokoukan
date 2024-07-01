// 🐉🐉🐉 required to not make react-speech-recognition crash the app
import "regenerator-runtime/runtime";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { type UseFormReturn } from "react-hook-form";
import { useCallback, useEffect } from "react";

export function useVoiceInput<
  TFormFieldName extends string,
  TForm extends UseFormReturn<{ TFormFieldName: string }>,
>({ form, formField }: { form: TForm; formField: TFormFieldName }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const shartListening = useCallback(() => {
    if (listening) {
      resetTranscript();
    }

    void SpeechRecognition.startListening({ language: "ja" });
  }, [listening, resetTranscript]);

  const stopListening = useCallback(() => {
    void SpeechRecognition.stopListening();

    const currentFormValue = form.getValues(formField);
    const endsWithPunctuation = currentFormValue
      .trim()
      .match(/[\.\,\:\;\?\!\。\、\？\！\…]$/);
    const newFormValue = `${currentFormValue}${endsWithPunctuation ? "。" : ""} ${transcript}`;
    form.setValue(formField, newFormValue);
  }, [form, formField, transcript]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        shartListening();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        stopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });
}
