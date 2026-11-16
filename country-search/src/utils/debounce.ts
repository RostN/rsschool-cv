export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return (...args: T): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = undefined;
      fn(...args);
    }, delay);
  };
}
