import { trace, context } from "@opentelemetry/api";

export function getActiveTraceId() {
  const activeSpan = trace.getSpan(context.active());
  if (activeSpan) {
    return activeSpan.spanContext().traceId;
  }
  return null;
}
