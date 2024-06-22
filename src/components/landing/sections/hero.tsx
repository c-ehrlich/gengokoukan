import Image from "next/image";
import landingImg from "../resources/landing-image-v1.png";
import { LoginButton } from "../../login-button";

export function Hero() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col justify-center px-8">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 flex-col justify-center gap-8">
          <h2 className="text-8xl">Converse your way to fluency</h2>
          <div>
            <LoginButton size="fuckin-huge" loginText="Get started" />
          </div>
        </div>
        <div className="flex-1">
          <Image src={landingImg} alt="Landing Image" />
        </div>
      </div>
    </div>
  );
}
