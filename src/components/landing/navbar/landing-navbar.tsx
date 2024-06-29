import { LoginButton } from "~/components/login-button";

export function LandingNavBar() {
  return (
    <div className="flex w-full items-center justify-between bg-muted p-2">
      <h1 className="text-2xl font-bold">言語交換</h1>
      <LoginButton
        onLandingPage={true}
        loginText="Sign in"
        logoutText="You should not be seeing this"
        size="regular"
      />
    </div>
  );
}
