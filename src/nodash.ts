export function countBy<T>(
  collection: readonly T[],
  iteratee: keyof T | ((item: T) => string),
): Record<string, number> {
  const result: Record<string, number> = {};
  const callback =
    typeof iteratee === "function"
      ? iteratee
      : (item: T) => String(item[iteratee]);

  for (const item of collection) {
    const key = callback(item);
    result[key] = (result[key] || 0) + 1;
  }
  return result;
}

export function groupBy<T>(
  collection: readonly T[],
  iteratee: keyof T | ((item: T) => string),
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  const callback =
    typeof iteratee === "function"
      ? iteratee
      : (item: T) => String(item[iteratee]);

  for (const item of collection) {
    const key = callback(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

export function orderByDesc<T>(
  collection: readonly T[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iteratee: keyof T | ((item: T) => any),
): T[] {
  return [...collection].sort((a, b) => {
    const valueA = typeof iteratee === "function" ? iteratee(a) : a[iteratee];
    const valueB = typeof iteratee === "function" ? iteratee(b) : b[iteratee];
    if (valueA === valueB) {
      return 0;
    }
    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueB.localeCompare(valueA);
    }
    return valueB > valueA ? 1 : -1;
  });
}

export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, val) => acc + val, 0);
}
