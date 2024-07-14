import { NavBar } from "../../components/navbar";
import LandingPage from "~/components/landing/landing-page";
import { getServerAuthSession } from "~/server/auth";
import "~/styles/globals.css";

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

        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
}
