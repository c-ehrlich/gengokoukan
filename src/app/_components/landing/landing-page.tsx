import { NavBar } from "../navbar";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex max-w-4xl flex-col items-center justify-center gap-2">
          <h2 className="text-7xl">
            Learn Japanese by talking to the computer
          </h2>
          <h3>Easy Immersion</h3>
          <p>
            Finding long term tandem partners is hard. Gengokoukan solves this
            by letting you create as many virtual conversation partners as you
            want.
          </p>
          <h3>Design your conversation partner</h3>
          <p>
            Choose their age, gender, regionional dialect, personality, hobbies,
            and much more.
          </p>
          <h3>Natural SRS</h3>
          <p>
            Mark words that you struggle with, and your conversation partner
            will use them again until you have learned them
          </p>
        </div>
      </main>
    </div>
  );
}
