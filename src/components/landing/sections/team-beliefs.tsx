import Image from "next/image";
import buildingRobotImg from "../resources/landing_v2_4.jpeg";

export function TeamBeliefs() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-orange-100 px-8 py-16">
      <div className="flex max-w-5xl flex-col items-center gap-8">
        <h3 className="w-full text-center text-4xl font-semibold">
          Built by Experienced Language Learners
        </h3>
        <div className="flex flex-row gap-8">
          <div className="flex max-w-xl flex-col gap-2 text-black">
            <p>
              Everyone on our team has achieved JLPT N1 or an equivalent in
              another foreign language.
            </p>
            <p>
              We know how difficult it is to stay motivated, learn grammar,
              grind vocabulary, and find the courage to start talking with
              native speakers in everyday life.
            </p>
            <p>
              Between us, we have spent thousands of hours in Anki, and probably
              just as many dollars on courses.
            </p>
            <p>
              And yet, we never felt like we were making progress as fast as we
              could have been. There missing link was the ability to communicate
              with native speakers in real-time, without the cost of private
              tutors or the hassle of scheduling conversations with tandem
              partners.
            </p>
            <p>
              We created kaiwa.club to help you have an easier time than we did.
            </p>
          </div>

          <div className="overflow-clip rounded-2xl shadow-xl">
            <Image src={buildingRobotImg} alt="Building robot" />
          </div>
        </div>
      </div>
    </div>
  );
}
