import { NavBar } from "../../components/navbar";
import { redirect } from "next/navigation";
import LandingPage from "~/components/landing/landing-page";
import { getServerAuthSession } from "~/server/auth";
import "~/styles/globals.css";
import { api } from "~/trpc/server";

export const metadata = {
  title: "会話クラブ - kaiwa.club",
  description: "気軽に会話を楽しもう！",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    return <LandingPage />;
  }

  const profile = await api.user.getProfile();

  if (!profile) {
    return redirect("/profile");
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
