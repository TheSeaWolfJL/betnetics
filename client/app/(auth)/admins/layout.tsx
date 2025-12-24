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
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
