import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export async function NavBar() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <h1 className="text-red-500">言語交換 (gengokoukan)</h1>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-green-500 px-10 py-3 font-semibold no-underline transition hover:bg-green-700"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </nav>
  );
}
