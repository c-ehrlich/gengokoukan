import { OpenAI } from "./openai";
import { trace } from "@opentelemetry/api";
import { type RequestOptions } from "openai/core.mjs";
import { type ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs";

const OPENAI_TRACER_NAME = "cje.kaiwaclub.openai";
const OPENAI_SPAN_NAME = "openai.prompt";

export const openaiWithSpan = async ({
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
