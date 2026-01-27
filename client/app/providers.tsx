'use client';

import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider } from '@heroui/react';
import { HeroUIProvider } from '@heroui/system';

export interface ProvidersProps {
  children: React.ReactNode;
  dehydratedState: DehydratedState;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchInterval: 30 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <HeroUIProvider
          className="flex w-full hide-scrollbar"
          navigate={router.push}
        >
          <ToastProvider />
          {children}
        </HeroUIProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
