import type { Country, RawCountry } from '../types/country.js';
import { mapCountryResponse } from '../utils/mapCountryResponse.js';

const BASE_URL = 'https://countries.dev/name';
const DEFAULT_TIMEOUT_MS = 15000;

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `HTTP Error: ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function searchCountries(
  query: string,
  signal: AbortSignal,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Country[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const composedSignal = AbortSignal.any([signal, timeoutSignal]);

  const url = `${BASE_URL}/${encodeURIComponent(trimmed)}`;
  const response = await fetch(url, { signal: composedSignal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Ошибка сервера (${response.status}): ${response.statusText}`
    );
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return (data as RawCountry[]).map(mapCountryResponse);
}
