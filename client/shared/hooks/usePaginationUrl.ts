import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook returning a handler that writes pagination params (limit and skip) into the URL.
 *
 * @returns A function that updates URL with limit and skip parameters
 */
export const usePaginationUrl = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (limit: number | string, skip: number | string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('limit', String(limit));
      params.set('skip', String(skip));

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams]
  );
};
