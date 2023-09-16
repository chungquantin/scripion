export function iterateObject<T, R>(
  obj: Record<string, T>,
  callback: (item: T, index: number) => R
) {
  return Object.keys(obj).map((key, index) => callback(obj[key], index));
}
