import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SortDirection = 'asc' | 'desc';

/**
 * Hook returning a handler that writes sort params into the URL.
 * Only allows the provided column keys.
 *
 * @param allowedKeys - list of column keys that are allowed for sorting
 */
export const useSortUrl = (allowedKeys: string[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (sortBy: string, direction: SortDirection) => {
      if (!allowedKeys.includes(sortBy)) return;
      const params = new URLSearchParams(searchParams.toString());

      params.set('sortBy', sortBy);
      params.set('order', direction);

      const queryString = params.toString();

      router.replace(`${pathname}?${queryString}`);
    },
    [allowedKeys, pathname, router, searchParams]
  );
};
