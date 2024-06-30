import Image from "next/image";
import landingImage2 from "../resources/landing-2-v1.png";
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
    <div className="flex flex-row items-start gap-8 bg-red-200 p-4">
      <div>
        <Image src={landingImage2} alt="A person talking to a computer" />
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-4xl font-bold">Get fluent now!</h3>
        <div className="flex min-h-96 flex-col justify-center gap-4 text-black">
          {featureItems.map((item, i) => {
            return (
              <div
                key={`feature-item-${i}`}
                className="text-bold flex items-start gap-2 text-xl"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-200">
                  <p>{i + 1}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{item.header}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="py-6">
          <LoginButton size="large" onLandingPage loginText="Get started" />
        </div>
      </div>
    </div>
  );
}
