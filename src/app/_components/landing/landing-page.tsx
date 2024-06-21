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
        </div>
      </main>
    </div>
  );
}
