import "~/styles/globals.css";

import { NavBar } from "../../components/navbar";
import { getServerAuthSession } from "~/server/auth";
import LandingPage from "~/components/landing/landing-page";

export default async function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    return <LandingPage />;
  }

  return (
    <>
      {/* TODO: put this in other places maybe? */}
      {/* <Sidebar /> */}
      <div className="flex min-h-screen w-full flex-col items-center">
        <NavBar />

        <div className="py-4">{children}</div>
      </div>
    </>
  );
}
