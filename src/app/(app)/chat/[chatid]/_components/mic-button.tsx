"use client";

import { useVoiceInput } from "./use-voice-input";
import { MicIcon } from "lucide-react";
import React from "react";
import "regenerator-runtime/runtime";
import { Button } from "~/components/_primitives/shadcn-raw/button";

export function MicButton({ form }: { form: any }) {
  const { listening } = useVoiceInput({
    // TODO: dont type form as any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    form: form,
    formField: "message",
  });

  return (
    <React.Fragment>
      {listening ? (
        <Button
          size="icon"
          variant="secondary"
          className="shadow-md, animate-pulse rounded-full bg-green-500"
        >
          <MicIcon className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full shadow-md"
        >
          <MicIcon className="h-5 w-5" />
        </Button>
      )}
    </React.Fragment>
  );
}
