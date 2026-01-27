'use client';

export default function BaseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full justify-center sm:items-center items-start bg-bg-main min-h-screen h-full">
      {children}
    </div>
  );
}
