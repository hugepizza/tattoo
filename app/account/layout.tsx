import TopBar from "../components/TopBar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col w-full h-full">
      <TopBar />
      {children}
    </section>
  );
}
