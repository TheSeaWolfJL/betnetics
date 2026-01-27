export function ageWithPlural(age: number): string {
  if (!Number.isInteger(age) || age < 0) {
    throw new Error('Age must be a non-negative integer');
  }

  const mod10 = age % 10;
  const mod100 = age % 100;

  if (mod100 >= 11 && mod100 <= 14) return ` (${age} лет)`;
  if (mod10 === 1) return ` (${age} год)`;
  if (mod10 >= 2 && mod10 <= 4) return ` (${age} года)`;

  return ` (${age} лет)`;
}

export function formatDate(date: string): string {
  if (date === '') return '';
  const [year, month, day] = date.split('-');

  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');

  return `${paddedDay}.${paddedMonth}.${year}`;
}

export function resolveSortIndex(
  value: string | null,
  allowed: readonly string[],
  fallback = '0'
): string {
  return value && allowed.includes(value)
    ? String(allowed.indexOf(value))
    : fallback;
}

export function isEqualDeep(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      isEqualDeep(a[key], b[key])
  );
}
