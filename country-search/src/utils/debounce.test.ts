import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution until delay has elapsed', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('sp');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('sp');
  });

  it('resets the timer when called repeatedly within the delay window', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('s');
    vi.advanceTimersByTime(200);

    debounced('sp');
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    debounced('spain');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('spain');
  });

  it('allows subsequent calls after the previous timer completes', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('first');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    debounced('second');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });
});
