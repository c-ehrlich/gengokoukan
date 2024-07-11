import { trace } from "@opentelemetry/api";
import { dbQueryContext } from ".";

export function dbCallWithSpan<TArgs, TReturn>(
  fn: (args: TArgs) => Promise<TReturn>,
  queryName?: string,
) {
  return async (args: TArgs) => {
    const span = trace.getTracer("kaiwa").startSpan("drizzle.query");

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
