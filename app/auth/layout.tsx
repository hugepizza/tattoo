"use client";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section  className="flex w-full h-full">{children}</section>;
}
