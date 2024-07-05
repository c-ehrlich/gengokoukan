import Image from "next/image";
import landingImage2 from "../resources/landing_v2_2.jpeg";
import { LoginButton } from "../../login-button";

type FeatureItem = {
  header: string;
  description: string;
};

const featureItems: FeatureItem[] = [
  {
    header: "Immerse without stress",
    description:
      "Finding long term tandem partners is hard. Kaiwa solves this by letting you create as many virtual conversation partners as you want.",
  },
  {
    header: "Enjoy your conversations",
    description:
      "Can't find a person from Hokkaido who is into Klaus Nomi and bobsled racing? Choose their age, gender, regionional dialect, personality, hobbies, and much more.",
  },
  {
    header: "Get feedback",
    description:
      "Kaiwa will tell you which aspect of your communication sucks the most, so you can focus on improving it",
  },
  {
    header: "SRS without the pain",
    description:
      "Mark words that you struggle with, and your conversation partner will use them again until you have learned them",
  },
  {
    header: "Stick with it long term",
    description:
      "Talk about the stuff that interests you, or that you want to be able to talk about with real people",
  },
];

export function Features() {
  return (
    <div className="flex w-full flex-col items-center bg-orange-100">
      <div className="flex max-w-5xl flex-row items-start gap-8 py-8">
        <div className="mt-20 overflow-clip rounded-3xl shadow-xl">
          <Image src={landingImage2} alt="A person talking to a computer" />
        </div>
        <div className="flex flex-col gap-8">
          <h3 className="text-4xl font-bold">The Easy Way to Learn Speaking</h3>
          <div className="flex min-h-96 flex-col justify-center gap-4 text-black">
            {featureItems.map((item, i) => {
              return (
                <div
                  key={`feature-item-${i}`}
                  className="text-bold flex items-start gap-2 text-xl"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-orange-500 bg-orange-300">
                    <p className="font-semibold text-black">{i + 1}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{item.header}</h3>
                    <p className="text-gray-800">{item.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="py-6">
              <LoginButton size="large" onLandingPage loginText="Get started" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
