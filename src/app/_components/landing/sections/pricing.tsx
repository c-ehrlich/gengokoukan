import landingImage3 from "../resources/landing-3-v1.png";
import Image from "next/image";

export function Pricing() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full items-center gap-4 px-16 py-2">
        <div className="flex h-full w-1/2 items-center">
          <div className="flex h-full flex-col items-center gap-4">
            <h2 className="text-4xl">Pricing</h2>
            <div className=" flex h-full w-full flex-row gap-2">
              <div className="h-full w-1/2 bg-white p-2 text-black">
                <h3>Free</h3>
                <ul className="list-disc">
                  <li>Send 10 messages per day</li>
                  <li>7 days conversation history</li>
                  <li>SRS for 30 days</li>
                </ul>
                <button className="bg-blue-500 p-2">Sign up</button>
              </div>
              <div className="h-full w-1/2 bg-white p-2 text-black">
                <h3>$10/month</h3>
                <ul className="list-disc">
                  <li>Unlimited messages</li>
                  <li>Unlimited conversation history</li>
                  <li>Unlimited </li>
                </ul>
                <button className="bg-blue-500 p-2">Sign up</button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <Image src={landingImage3} alt="A person talking to a computer" />
        </div>
      </div>
    </div>
  );
}
