import { getServerAuthSession } from "~/server/auth";
import LandingPage from "../components/landing/landing-page";
import AppLayout from "./(app)/layout";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return <LandingPage />;
  }

  return (
    <AppLayout>
      <main className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex h-full w-full flex-1 flex-col"></div>
      </main>
    </AppLayout>
  );
}
