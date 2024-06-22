import { getServerAuthSession } from "~/server/auth";
import LandingPage from "../components/landing/landing-page";
import { TextWithTooltip } from "../components/text-with-tooltip";
import { NavBar } from "../components/navbar";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    return <LandingPage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <NavBar />

      <div className="flex h-full w-full flex-1 flex-col">
        <TextWithTooltip text="わしの名前は健太や。あんた、ウィーンに住んでるんか！めっちゃええやん。それにしても、離婚して娘さんと会うのが少なくなるんは寂しいな。\n「会うきっかけが少なくなちゃった」やけど、「少なくなってしまった」の方が自然やで。\nウィーンでの生活はどないや？日本と違うところとか、特に面白いことがあったら教えてや。" />
      </div>
    </main>
  );
}
