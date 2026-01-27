import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { normalizeSkip } from '../constants';
import { getUrlLimits } from '../utils/urlLimitUtils';

export const useInitializeUrlParams = (defaultParams: {
  skip: string;
  limit: string;
  order?: string;
  sortBy?: string;
  key?: string;
  value?: string;
}) => {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchParams.size === 0) {
      if (defaultParams.order && defaultParams.sortBy) {
        params.set('order', defaultParams.order);
        params.set('sortBy', defaultParams.sortBy);
      }
      if (defaultParams.key && defaultParams.value) {
        params.set('key', defaultParams.key);
        params.set('value', defaultParams.value);
      }
      // Check localStorage for limit
      const storedLimit = localStorage.getItem('limit');
      params.set('limit', storedLimit || defaultParams.limit);
      params.set('skip', defaultParams.skip);
      const queryString = params.toString();

      nextRouter.replace(`${pathname}?${queryString}`);
    }
    // For limit: if exists in localStorage, use it; else use from searchParams
    const storedLimit = localStorage.getItem('limit');
    const currentLimit = storedLimit || getUrlLimits(searchParams).limit;
    params.set('limit', currentLimit);
    params.set(
      'skip',
      normalizeSkip(
        currentLimit,
        getUrlLimits(searchParams).skip
      )
    );
    const queryString = params.toString();

    nextRouter.replace(`${pathname}?${queryString}`);
  }, [searchParams, nextRouter, pathname, defaultParams]);
};
