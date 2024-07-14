import { env } from "~/env";

export function getTraceLink(traceId: string) {
  if (env.NODE_ENV === "development") {
    // TODO: put in env
    let res = `https://app.axiom.co/ce-test-cdbr/trace?traceId=${traceId}`;
    const traceDataset = process.env.AXIOM_DATASET;
    if (traceDataset) {
      res += `&traceDataset=${traceDataset}`;
    }
    return res;
  }

  return `TRACE CONFIG MISSING - ${traceId}`;
}
