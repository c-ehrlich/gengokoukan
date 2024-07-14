import { LoginButton } from "../../login-button";
import landingImage2 from "../resources/landing_v2_2.jpeg";
import Image from "next/image";
import { LandingAccordion } from "~/components/_primitives/ui/landing-accordion";

type FeatureItem = {
  title: string;
  description: string;
};

const featureItems: FeatureItem[] = [
  {
    title: "Immerse without stress",
    description:
      "Finding long term tandem partners is hard. Kaiwa solves this by letting you create as many virtual conversation partners as you want.",
  },
  {
    title: "Design your conversations",
    description:
      "Choose from a variety of common situations, or create your own. Kaiwa lets you create custom conversation partners and situations.",
  },
  {
    title: "Get feedback",
    description:
      "Kaiwa will tell you which aspect of your communication sucks the most, so you can focus on improving it",
  },
  {
    title: "SRS without the pain",
    description:
      "Mark words that you struggle with, and your conversation partner will use them again until you have learned them",
  },
  {
    title: "Stick with it long term",
    description:
      "Talk about the stuff that interests you, or that you want to be able to talk about with real people",
  },
];

export function Features() {
  return (
    <div className="flex w-full flex-col items-center bg-orange-100 px-4">
      <div className="w-full text-center">
        <h3 className="text-6xl font-semibold">
          The Easy Way to Learn Speaking
        </h3>
      </div>
      <div className="flex max-w-5xl flex-col items-start gap-8 py-8 md:flex-row">
        <div className="overflow-clip rounded-3xl shadow-xl md:flex-1">
          <Image src={landingImage2} alt="A person talking to a computer" />
        </div>
        <div className="flex flex-col gap-8 md:flex-1">
          <div className="flex min-h-96 flex-col justify-center gap-4 text-black">
            <LandingAccordion items={featureItems} />
          </div>
        </div>
      </div>
      <div className="py-6">
        <LoginButton size="large" onLandingPage loginText="Get started" />
      </div>
    </div>
  );
}
