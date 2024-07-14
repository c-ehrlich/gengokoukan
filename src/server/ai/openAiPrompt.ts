import { OpenAI } from "./openai";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { TRPCError } from "@trpc/server";
import { type RequestOptions } from "openai/core.mjs";
import { type ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";
import { type z } from "zod";

const OPENAI_TRACER_NAME = "cje.kaiwaclub.openai";
const OPENAI_SPAN_NAME = "openai.prompt";

type OpenAIPromptArgs<TZodSchema extends Record<string, any>> = {
  prompt: {
    body: ChatCompletionCreateParamsNonStreaming;
    options?: RequestOptions;
    name: string;
  };
  schema: z.ZodObject<TZodSchema>;
};

export async function openAiPrompt<TZodSchema = Record<string, any>>({
  prompt,
  schema,
}: OpenAIPromptArgs<
  TZodSchema extends Record<string, any> ? TZodSchema : never
>) {
  const span = trace.getTracer(OPENAI_TRACER_NAME).startSpan(OPENAI_SPAN_NAME);

  const completion = await OpenAI.chat.completions.create(
    prompt.body,
    prompt.options,
  );

  span.setAttributes({
    "ai.model": prompt.body.model,
    "ai.promptName": prompt.name,
  });

  if (typeof prompt.body.messages[0]?.role === "string") {
    span.setAttribute("ai.role", prompt.body.messages[0].role);
  }
  if (typeof prompt.body.messages[0]?.content === "string") {
    span.setAttribute("ai.prompt", prompt.body.messages[0].content);
  }
  if (completion.choices[0]?.message.content) {
    span.setAttribute("ai.response", completion.choices[0].message.content);
  }
  if (completion.usage) {
    span.setAttributes({
      "ai.usage.promptTokens": completion.usage.prompt_tokens,
      "ai.usage.completionTokens": completion.usage.completion_tokens,
      "ai.usage.totalTokens": completion.usage.total_tokens,
    });
  }

  if (!completion.choices[0]) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a message",
    });
  }

  const rawMessage = completion.choices[0].message.content;
  const extractedJson = (rawMessage?.match(/\{[\s\S]*\}/) ?? [])[0];

  let jsonParsed: unknown;
  try {
    jsonParsed = JSON.parse(extractedJson ?? "null");
  } catch (e) {
    console.error("error parsing model response:", e);

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: "AI did not return a valid message",
    });
    span.end();

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a valid message",
    });
  }

  const contentParsed = schema.safeParse(jsonParsed);

  if (!contentParsed.success) {
    console.error("error parsing model response:", contentParsed.error);

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: "AI did not return a valid message",
    });
    span.end();

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a valid message",
    });
  }

  span.end();

  return contentParsed.data;
}
