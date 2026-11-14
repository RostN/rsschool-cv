import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchController } from './searchController.js';
const mockSpain = {
  name: 'Spain',
  officialName: 'Kingdom of Spain',
  flag: 'https://flagcdn.com',
  capital: 'Madrid',
  region: 'Europe',
  population: 47351567,
  area: 505992,
  languages: ['Spanish'],
  currencies: ['Euro (€)'],
  borders: ['FRA'],
  description: '',
};
const mockGermany = {
  name: 'Germany',
  officialName: 'Federal Republic of Germany',
  flag: 'https://flagcdn.com',
  capital: 'Berlin',
  region: 'Europe',
  population: 83240525,
  area: 357114,
  languages: ['German'],
  currencies: ['Euro (€)'],
  borders: ['FRA'],
  description: '',
};
describe('SearchController', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('aborts previous request and ignores slow first response when second resolves faster (race condition)', async () => {
    let resolveFirst;
    let resolveSecond;
    const signals = [];
    const fetcher = vi.fn((query, signal) => {
      signals.push(signal);
      if (query === 'sp') {
        return new Promise((resolve) => {
          resolveFirst = resolve;
        });
      }
      return new Promise((resolve) => {
        resolveSecond = resolve;
      });
    });
    const states = [];
    const controller = new SearchController(fetcher, (state) => {
      states.push({ ...state });
    });
    const p1 = controller.search('sp');
    expect(signals.at(0)?.aborted).toBe(false);
    const p2 = controller.search('spain');
    expect(signals.at(0)?.aborted).toBe(true);
    expect(signals.at(1)?.aborted).toBe(false);
    // Second request resolves first
    resolveSecond([mockSpain]);
    await p2;
    expect(controller.getState().status).toBe('success');
    expect(controller.getState().results).toEqual([mockSpain]);
    // First (slow) request resolves later — must NOT overwrite state
    resolveFirst([mockGermany]);
    await p1;
    expect(controller.getState().results).toEqual([mockSpain]);
    expect(controller.getState().query).toBe('spain');
  });
  it('aborts active request and resets state to idle when input is cleared', async () => {
    let capturedSignal;
    const fetcher = vi.fn((_query, signal) => {
      capturedSignal = signal;
      return new Promise(() => {});
    });
    const controller = new SearchController(fetcher, () => {});
    void controller.search('Germany');
    expect(capturedSignal.aborted).toBe(false);
    expect(controller.getState().status).toBe('loading');
    await controller.search('   ');
    expect(capturedSignal.aborted).toBe(true);
    expect(controller.getState().status).toBe('idle');
    expect(controller.getState().results).toEqual([]);
  });
  it('caches successful results by normalized key and deduplicates in-flight requests', async () => {
    let resolveFetch;
    const fetcher = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );
    const controller = new SearchController(fetcher, () => {});
    // Two concurrent searches with equivalent normalized keys
    const p1 = controller.search('  Spain ');
    const p2 = controller.search('spain');
    expect(fetcher).toHaveBeenCalledTimes(1);
    resolveFetch([mockSpain]);
    await Promise.all([p1, p2]);
    expect(controller.getState().results).toEqual([mockSpain]);
    // Subsequent search with same normalized key uses cache
    await controller.search('SPAIN');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(controller.getState().results).toEqual([mockSpain]);
  });
  it('stores up to 5 unique recent queries in localStorage', async () => {
    const fetcher = vi.fn(async () => [mockSpain]);
    const controller = new SearchController(fetcher, () => {});
    for (const name of [
      'France',
      'Italy',
      'Spain',
      'Germany',
      'Japan',
      'Spain',
    ]) {
      await controller.search(name);
    }
    const history = controller.getHistory();
    expect(history).toEqual(['Spain', 'Japan', 'Germany', 'Italy', 'France']);
    expect(history).toHaveLength(5);
  });
});
