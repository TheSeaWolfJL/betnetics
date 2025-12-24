import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'посты',
};

export default function PostsLayout({
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
