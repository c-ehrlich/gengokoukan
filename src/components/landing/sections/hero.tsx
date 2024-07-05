import Image from "next/image";
import landingImg from "../resources/landing_v2_1.jpg";
import { LoginButton } from "../../login-button";

export function Hero() {
  return (
    <div className="min-w-5xl flex h-full min-h-[50vh] flex-col justify-center px-8">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <h2 className="p-2 text-8xl">Converse your way to fluency</h2>
          <div>
            <LoginButton size="fuckin-huge" loginText="Get started" />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={landingImg}
            alt="Landing Image"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
