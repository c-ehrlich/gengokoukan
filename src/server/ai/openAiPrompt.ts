import { OpenAI } from "./openai";
import { trace } from "@opentelemetry/api";
import { TRPCError } from "@trpc/server";
import { type RequestOptions } from "openai/core.mjs";
import { type ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";
import { type z } from "zod";

const OPENAI_TRACER_NAME = "cje.kaiwaclub.openai";
const OPENAI_SPAN_NAME = "openai.prompt";

const openaiWithSpan = async ({
  body,
  options,
  name,
}: {
  body: ChatCompletionCreateParamsNonStreaming;
  options?: RequestOptions;
  name?: string;
}) => {
  const span = trace.getTracer(OPENAI_TRACER_NAME).startSpan(OPENAI_SPAN_NAME);

  const res = await OpenAI.chat.completions.create(body, options);

  span.setAttributes({
    "ai.model": body.model,
  });
  if (typeof body.messages[0]?.role === "string") {
    span.setAttribute("ai.role", body.messages[0].role);
  }
  if (typeof body.messages[0]?.content === "string") {
    span.setAttribute("ai.prompt", body.messages[0].content);
  }
  if (res.choices[0]?.message.content) {
    span.setAttribute("ai.response", res.choices[0].message.content);
  }
  if (res.usage) {
    span.setAttributes({
      "ai.usage.promptTokens": res.usage.prompt_tokens,
      "ai.usage.completionTokens": res.usage.completion_tokens,
      "ai.usage.totalTokens": res.usage.total_tokens,
    });
  }

  span.end();

  return res;
};

type OpenAIPromptArgs<
  TZodSchema extends Record<string, any> = Record<string, any>,
> = {
  prompt: {
    body: ChatCompletionCreateParamsNonStreaming;
    name: string;
  };
  schema: z.ZodObject<TZodSchema>;
};

export async function openAiPrompt({ prompt, schema }: OpenAIPromptArgs) {
  const completion = await openaiWithSpan(prompt);

  if (!completion.choices[0]) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a message",
    });
  }

  const rawMessage = completion.choices[0].message.content;
  const extractedJson = (rawMessage?.match(/\{[\s\S]*\}/) ?? [])[0];

  // TODO: include `couldParseJson` or similar on span
  let jsonParsed: unknown;
  try {
    jsonParsed = JSON.parse(extractedJson ?? "null");
  } catch (e) {
    console.error("error parsing model response:", e);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a valid message",
    });
  }

  // TODO: include `couldParseSchema` or similar on span
  const contentParsed = schema.safeParse(jsonParsed);

  if (!contentParsed.success) {
    console.error("error parsing model response:", contentParsed.error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "AI did not return a valid message",
    });
  }

  return contentParsed.data;
}
