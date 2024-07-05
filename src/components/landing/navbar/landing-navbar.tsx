import { MessagesSquareIcon } from "lucide-react";
import { LoginButton } from "~/components/login-button";

export function LandingNavBar() {
  return (
    <div className="fixed left-0 top-0 z-20 flex w-full items-center justify-center bg-orange-100 p-2">
      <div className="flex w-full max-w-5xl items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <MessagesSquareIcon strokeWidth={3} />
          <h1 className="text-2xl font-bold">kaiwa.club</h1>
        </div>
        <LoginButton
          onLandingPage={true}
          loginText="Sign in"
          logoutText="You should not be seeing this"
          size="regular"
        />
      </div>
    </div>
  );
}
