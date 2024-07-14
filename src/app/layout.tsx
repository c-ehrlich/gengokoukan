import { GeistSans } from "geist/font/sans";
import { cn } from "~/components/_utils/cn";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = {
  title: "会話クラブ - kaiwa.club",
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
            "relative bg-background font-sans antialiased",
            GeistSans.variable,
          )}
        >
          <div className="noise"></div>
          <main className="relative z-10 flex min-h-screen flex-row justify-center">
            {children}
          </main>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
