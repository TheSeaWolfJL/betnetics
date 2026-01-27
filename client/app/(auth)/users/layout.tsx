export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full h-full items-center justify-center">
      {children}
    </section>
  );
}
