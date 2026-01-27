import { pageLimit } from '../constants';

export const getUrlLimits = (
  searchParams: URLSearchParams
): { limit: string; skip: string } => {
  const min = String(pageLimit[0]);
  const max = String(pageLimit[pageLimit.length - 1]);
  const rawLimit = searchParams.get('limit');
  let rawSkip = searchParams.get('skip');

  if (!rawSkip) {
    rawSkip = '0';
  }

  const numLimit = Number(rawLimit);

  // Clamp to bounds
  if (numLimit <= Number(min)) {
    return { limit: min, skip: rawSkip };
  }

  if (numLimit >= Number(max)) {
    return { limit: max, skip: rawSkip };
  }

  // Accept only predefined limits
  if (pageLimit.includes(String(rawLimit))) {
    return { limit: rawLimit || min, skip: rawSkip };
  }

  // Fallback
  return { limit: min, skip: rawSkip };
};
