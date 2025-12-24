import clsx from 'clsx';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { DehydratedState } from '@tanstack/react-query';

import { Providers } from './providers';

import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import BaseRootLayout from '@/shared/layouts/baseLayout';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx('min-h-screen', fontSans.className)}>
        <Providers dehydratedState={dehydratedState}>
          <BaseRootLayout>{children}</BaseRootLayout>
        </Providers>
      </body>
    </html>
  );
}
