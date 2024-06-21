import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex max-w-4xl flex-col items-center justify-center gap-2">
          <h2 className="text-7xl">
            Learn Japanese by talking to the computer
          </h2>
        </div>
      </main>
    </div>
  );
}

export async function NavBar() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl items-center justify-between">
        <h1>言語交換 (gengokoukan)</h1>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </nav>
  );
}
