import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "./providers/nextauth";
import { Session } from "next-auth";
import TopBar from "./components/TopBar";

export const metadata: Metadata = {
  title: "Tattoo by AI",
  description: "Design Your Unique Tattoo By AI",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className="flex flex-col w-full h-full">
          <TopBar />
          {/* {children} */}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
