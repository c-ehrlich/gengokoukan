import bgTest from "../resources/bg-test-1.png";
import pricingLeft from "../resources/pricing-left.png";
import pricingRight from "../resources/pricing-right.jpeg";
import { CircleCheckIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "~/components/_utils/cn";
import { LoginButton } from "~/components/login-button";

type PricingCardProps = {
  image: StaticImageData;
  title: string;
  catchphrase: string;
  price: React.ReactNode;
  features: Array<string>;
  cta: string;
};
function PricingCard({
  image,
  title,
  price,
  catchphrase,
  features,
  cta,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex h-full w-72 scale-110 flex-col overflow-clip rounded-b-3xl rounded-t-[100px] text-black shadow-2xl",
      )}
    >
      <div className="-mb-4 flex aspect-3/2 max-h-48 w-full items-center justify-center overflow-clip">
        <Image src={image} alt="foo" />
      </div>
      <div className="flex h-full flex-col justify-between gap-2 rounded-t-2xl bg-chatbubble p-4 [box-shadow:_0px_3px_10px_black]">
        <div className="flex h-full flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center justify-between">
            <h3 className="text-xl font-semibold">{title}</h3>
            <h4 className="text-sm">{price}</h4>
          </div>
          <p className="text-center text-sm tracking-tight">{catchphrase}</p>
          <ul className="flex w-full list-none flex-col items-start gap-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <div className="min-w-[18px]">
                  <CircleCheckIcon size={18} className="mt-[2px]" />
                </div>
                <p>{feature}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-4" />
        <LoginButton
          onLandingPage
          size="small"
          className="shadow-xl"
          loginText={cta}
        ></LoginButton>
      </div>
    </div>
  );
}

const pricingCards: Array<PricingCardProps> = [
  {
    image: pricingLeft,
    title: "Basic",
    catchphrase: "Start improving your output",
    price: "Free",
    features: [
      "20 messages per day",
      "3 active conversations",
      "3 hints per day",
      "7-day chat history",
      "SRS for 30 days",
    ],
    cta: "Start for Free",
  },
  {
    image: pricingRight,
    title: "Premium",
    catchphrase: "Accelerate your learning",
    price: (
      <div className="flex flex-col items-end">
        <s>$10 / month</s>
        <p>Free during Beta</p>
      </div>
    ),
    features: [
      "Unlimited messages",
      "Unlimited conversations",
      "Unlimited hints",
      "Unlimited conversation history",
      "Unlimited SRS",
    ],
    cta: "Get Premium",
  },
] as const;

export function Pricing() {
  return (
    <div className="relative flex w-full flex-col items-center gap-2 bg-orange-100 py-32">
      <Image
        src={bgTest}
        alt="landscape-background"
        className="absolute bottom-0 left-0 w-full opacity-50"
      />
      <div className="flex w-full flex-col items-center gap-4 px-16 py-2">
        <div className="flex h-full items-center">
          <div className="flex h-full flex-col items-center gap-24">
            <h2 className="text-6xl font-semibold">A tutor you can afford</h2>
            <div className=" flex h-full w-full flex-row gap-16">
              {pricingCards.map((card) => (
                <PricingCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </div>
        {/* <div className="w-1/2">
          <Image src={landingImage3} alt="A person talking to a computer" />
        </div> */}
      </div>
    </div>
  );
}
