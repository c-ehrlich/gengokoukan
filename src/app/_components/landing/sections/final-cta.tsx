import Image from "next/image";
import landingImage4 from "../resources/landing-4-v1.png";
import { LoginButton } from "../../login-button";

export function FinalCta() {
  return (
    <div className="relative flex min-h-96 flex-col items-center justify-center gap-12 bg-purple-400 px-8 pt-16">
      <div className="flex flex-row items-center">
        <div className="flex w-1/3 items-center justify-center pt-16">
          <Image src={landingImage4} alt="Two people talking" />
        </div>
        <div className="flex w-2/3 flex-col items-center justify-center gap-12 text-center">
          <h3 className="text-7xl">Get ready for real life conversations</h3>
          <LoginButton size="fuckin-huge" loginText="Get started" />
        </div>
      </div>
    </div>
  );
}
