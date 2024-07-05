import { Testimonials } from "./sections/testimonials";
import { Pricing } from "./sections/pricing";
import { TeamBeliefs } from "./sections/team-beliefs";
import { Hero } from "./sections/hero";
import { FinalCta } from "./sections/final-cta";
import { Features } from "./sections/features";
import { LandingNavBar } from "./navbar/landing-navbar";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center">
      <LandingNavBar />
      <Hero />
      <Features />
      <TeamBeliefs />
      <Pricing />
      <Testimonials />
      <FinalCta />
    </div>
  );
}
