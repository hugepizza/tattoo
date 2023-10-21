import { Session } from "next-auth";
import TopBar from "./TopBar";
import SessionProvider from "../providers/nextauth";

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
        <body className="flex flex-col w-full h-full">{children}</body>
      </html>
    </SessionProvider>
  );
}
