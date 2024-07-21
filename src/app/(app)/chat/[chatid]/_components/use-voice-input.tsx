"use client";

import { useCallback, useEffect } from "react";
import {
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export function useVoiceInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  formField,
}: {
  form: UseFormReturn<TFieldValues>;
  formField: TName;
}) {
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

    // TODO: figure out how to ensure it's a string field
    const currentFormValue = form.getValues(formField) as string;
    const endsWithPunctuation = Boolean(
      currentFormValue.trim().match(/[\.\,\:\;\?\!\。\、\？\！\…]$/),
    );
    const currentlyEmpty = currentFormValue.trim() === "";
    const shouldAddPeriod = !currentlyEmpty && !endsWithPunctuation;
    const newFormValue = `${currentFormValue}${shouldAddPeriod ? "。" : ""}${transcript}${transcript.trim() === "" ? "" : "。"}`;
    // @ts-expect-error TODO: figure out how to ensure it's a string field
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

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    shartListening,
    stopListening,
  };
}
