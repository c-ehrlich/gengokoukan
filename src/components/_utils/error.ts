export function getErrorString(e: unknown): string {
  if (typeof e === "string") {
    return e;
  }

  if (typeof e === "object" && e && "message" in e) {
    return String(e.message);
  }

  return JSON.stringify(e);
}
