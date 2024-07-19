import { dbQueryContext } from ".";
import { trace } from "@opentelemetry/api";

const DRIZZLE_TRACER_NAME = "cje.kaiwaclub.drizzlewrapper";
const DRIZZLE_SPAN_NAME = "drizzle.query";

export function dbCallWithSpan<TArgs, TReturn>(
  queryName: string,
  fn: (args: TArgs) => Promise<TReturn>,
) {
  return async (args: TArgs) => {
    const span = trace
      .getTracer(DRIZZLE_TRACER_NAME)
      .startSpan(DRIZZLE_SPAN_NAME);

    Object.entries(dbQueryContext).forEach(([key, value]) => {
      if (value) {
        span.setAttribute(key, value);
      }
    });

    const result = await fn(args);

    if (queryName) span.setAttribute("db.query", queryName);
    span.setAttribute("db.result", JSON.stringify(result));

    span.end();

    return result;
  };
}
