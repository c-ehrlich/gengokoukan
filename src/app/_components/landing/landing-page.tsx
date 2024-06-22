import { NavBar } from "../navbar";
import { Testimonials } from "./sections/testimonials";
import { Pricing } from "./sections/pricing";
import { TeamBeliefs } from "./sections/team-beliefs";
import { Hero } from "./sections/hero";
import { FinalCta } from "./sections/final-cta";
import { Features } from "./sections/features";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <NavBar />
      <main className="items-centera flex flex-1 flex-col bg-[#CECDB4] py-16 text-white">
        <Hero />
        <Features />
        <TeamBeliefs />
        <Pricing />
        <Testimonials />
        <FinalCta />
      </main>
    </div>
  );
}
