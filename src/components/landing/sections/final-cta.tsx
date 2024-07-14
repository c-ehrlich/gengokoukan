import { LoginButton } from "../../login-button";
import landingImage4 from "../resources/landing-4-v1.png";
import Image from "next/image";

export function FinalCta() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 bg-orange-100 px-8 pt-16">
      <div className="flex h-full flex-row items-center">
        <div className="flex h-full w-1/3 items-end justify-center pt-16">
          <Image src={landingImage4} alt="Two people talking" />
        </div>
        <div className="flex w-2/3 flex-col items-center justify-center gap-12 text-center">
          <h3 className="text-7xl font-semibold">
            Get ready for real life conversations
          </h3>
          <LoginButton
            onLandingPage
            size="fuckin-huge"
            loginText="Get started"
          />
        </div>
      </div>
    </div>
  );
}
