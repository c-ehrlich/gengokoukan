import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export async function ensureSignedIn() {
  const session = await getServerAuthSession();
  if (!session) redirect("/api/auth/signin");

  return session;
}
