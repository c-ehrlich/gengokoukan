import LandingPage from "~/components/landing/landing-page";
import { getServerAuthSession } from "~/server/auth";
import LandingLayout from "./landing/layout";
import RootAppLayout from "./(app)/layout";
import RootAppPage from "./(app)/page";

export default async function RootPage() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <LandingLayout>
        <LandingPage />
      </LandingLayout>
    );
  }

  return (
    <RootAppLayout>
      <RootAppPage />
    </RootAppLayout>
  );
}
