import Image from "next/image";
import landingImg from "../resources/landing_v2_1.jpg";
import { LoginButton } from "../../login-button";

export function Hero() {
  return (
    <div className="flex w-full flex-col items-center bg-orange-100 py-8">
      <div className="min-w-5xl flex h-full min-h-[50vh] flex-col justify-center px-8">
        <div className="flex flex-row items-center gap-12">
          <div className="flex flex-col items-center justify-center gap-12 text-center">
            <h2 className="max-w-[800px] p-2 text-8xl">
              Converse your way to fluency
            </h2>
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
    </div>
  );
}
