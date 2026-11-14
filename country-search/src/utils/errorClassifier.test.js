import { describe, it, expect } from 'vitest';
import { classifySearchError } from './errorClassifier.js';
import { HttpError } from '../api/searchCountries.js';
describe('classifySearchError', () => {
  it('identifies AbortError as silent user cancellation (isUserError: false)', () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    const result = classifySearchError(abortError);
    expect(result).toEqual({
      kind: 'aborted',
      isUserError: false,
      message: '',
    });
  });
  it('identifies TimeoutError separately from AbortError as a user-visible error', () => {
    const timeoutError = new DOMException('Timeout', 'TimeoutError');
    const result = classifySearchError(timeoutError);
    expect(result.kind).toBe('timeout');
    expect(result.isUserError).toBe(true);
    expect(result.message).toContain('время ожидания');
  });
  it('identifies HttpError with status code as a user-visible error', () => {
    const httpError = new HttpError(503, 'Service Unavailable');
    const result = classifySearchError(httpError);
    expect(result.kind).toBe('http');
    expect(result.isUserError).toBe(true);
    expect(result.message).toContain('503');
  });
  it('identifies generic network TypeError as a network error', () => {
    const networkError = new TypeError('Failed to fetch');
    const result = classifySearchError(networkError);
    expect(result.kind).toBe('network');
    expect(result.isUserError).toBe(true);
    expect(result.message).toContain('сети');
  });
});
