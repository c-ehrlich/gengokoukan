import "~/styles/globals.css";

import { NavBar } from "../../components/navbar";
import { Sidebar } from "../../components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="relative flex h-full w-full flex-col">
        <NavBar />

        {children}
      </div>
    </>
  );
}
