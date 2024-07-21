import { LandingNavBar } from "./navbar/landing-navbar";
import { Features } from "./sections/features";
import { FinalCta } from "./sections/final-cta";
import { Hero } from "./sections/hero";
import { Pricing } from "./sections/pricing";
import { TeamBeliefs } from "./sections/team-beliefs";
import { Testimonials } from "./sections/testimonials";

export const metadata = {
  title: "会話クラブ - kaiwa.club",
  description: "気軽に会話を楽しもう！",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center">
      <LandingNavBar />
      <Hero />
      <Features />
      <TeamBeliefs />
      <Testimonials />
      <Pricing />
      <FinalCta />
    </div>
  );
}
