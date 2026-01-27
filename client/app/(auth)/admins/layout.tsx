import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Admins',
  description: 'админчики',
};

export default function AdminsLayout({
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
