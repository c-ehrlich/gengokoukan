import Link from "next/link";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";

type LoginButtonProps = {
  size: "regular" | "large" | "fuckin-huge";
  loginText?: string;
  logoutText?: string;
  onLandingPage?: boolean;
};
export async function LoginButton({
  size = "regular",
  loginText,
  logoutText,
  onLandingPage,
}: LoginButtonProps) {
  const session = await getServerAuthSession();

  return (
    <Link
      href={session ? "/api/auth/signout" : "/api/auth/signin"}
      className={cn(
        "rounded-full bg-green-500 px-10 py-3 font-semibold no-underline transition hover:bg-green-700",
        { "px-10 py-3": size === "regular" },
        { "px-12 py-3 text-2xl": size === "large" },
        { "px-16 py-4 text-4xl": size === "fuckin-huge" },
      )}
    >
      {onLandingPage && session
        ? "Go to app"
        : session
          ? logoutText ?? "Sign out"
          : loginText ?? "Sign in"}
    </Link>
  );
}
