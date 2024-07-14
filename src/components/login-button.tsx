import { cn } from "./_utils/cn";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

type LoginButtonProps = {
  className?: string;
  size: "regular" | "large" | "fuckin-huge" | "small";
  loginText?: string;
  logoutText?: string;
  onLandingPage?: boolean;
};
export async function LoginButton({
  className,
  size = "regular",
  loginText,
  logoutText,
  onLandingPage,
}: LoginButtonProps) {
  const session = await getServerAuthSession();

  const logoutLink = onLandingPage ? "/" : "/api/auth/signout";

  return (
    <Link
      href={session ? logoutLink : "/api/auth/signin"}
      className={cn(
        "rounded-full bg-green-500 px-10 py-3 text-center font-semibold no-underline transition hover:bg-green-700",
        { "px-10 py-3": size === "regular" },
        { "px-12 py-3 text-2xl": size === "large" },
        { "px-16 py-4 text-4xl": size === "fuckin-huge" },
        { "px-6 py-2": size === "small" },
        className,
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
