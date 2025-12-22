import clsx from "clsx";
import "@/styles/globals.css";
import { Metadata } from "next";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { DehydratedState } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
  dehydratedState
}: {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen",
          fontSans.className,
        )}
      >
        <Providers dehydratedState={dehydratedState}>
          <div className="flex w-full justify-center items-center bg-bg-main h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
