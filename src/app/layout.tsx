import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";

import { cn } from "~/components/_utils/cn";

export const metadata = {
  title: "会話 - Kaiwa",
  description: "気軽に会話を楽しもう！",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <html lang="en" className={GeistSans.className}>
        <body
          className={cn(
            "dark bg-background font-sans antialiased",
            GeistSans.variable,
          )}
        >
          <main className="flex min-h-screen flex-row justify-center">
            {children}
          </main>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
