import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpError, searchCountries } from './searchCountries.js';

describe('searchCountries', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns empty array without calling fetch when query is empty or whitespace', async () => {
    const controller = new AbortController();
    const result = await searchCountries('   ', controller.signal);

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches countries and maps response on 200 OK', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        {
          name: 'Spain',
          capital: 'Madrid',
          region: 'Europe',
          population: 47351567,
          flag: 'https://flagcdn.com',
        },
      ],
    });

    const controller = new AbortController();
    const result = await searchCountries('Spain', controller.signal);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://countries.dev',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Spain');
    expect(result[0].capital).toBe('Madrid');
  });

  it('returns empty array on 404 Not Found instead of throwing', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const controller = new AbortController();
    const result = await searchCountries(
      'UnknownCountryXYZ',
      controller.signal
    );

    expect(result).toEqual([]);
  });

  it('throws HttpError with status code on non-404 HTTP error (e.g. 500)', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const controller = new AbortController();

    await expect(searchCountries('Spain', controller.signal)).rejects.toThrow(
      HttpError
    );

    try {
      await searchCountries('Spain', controller.signal);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).status).toBe(500);
    }
  });

  it('aborts the composed signal when caller signal is aborted', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      });
    });

    const controller = new AbortController();
    const promise = searchCountries('Spain', controller.signal);

    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('aborts with TimeoutError when request exceeds timeout', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(
            init.signal?.reason ??
              new DOMException('The operation timed out.', 'TimeoutError')
          );
        });
      });
    });

    const controller = new AbortController();
    const promise = searchCountries('Spain', controller.signal, 50);

    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });
});
