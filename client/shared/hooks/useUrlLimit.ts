import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Generic URL param reader. Defaults to the "limit" param.
 * @param defaultValue - value to return when param is not present
 * @param key - query param key to read (default: "limit")
 */
export const useUrlLimit = (
  defaultValue: string = '12',
  key: string = 'limit'
): string => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const param = searchParams.get(key);

    if (param) return param;

    return defaultValue;
  }, [searchParams, key, defaultValue]);
};
