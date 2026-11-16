import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from './mapCountryResponse.js';
import type { RawCountry } from '../types/country.js';

describe('mapCountryResponse', () => {
  it('maps a complete raw country object into domain Country model', () => {
    const raw: RawCountry = {
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505992,
      flag: 'https://flagcdn.com',
      languages: [{ code: 'spa', name: 'Spanish' }],
      currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      description: 'Country in Southwestern Europe.',
    };

    const result = mapCountryResponse(raw);

    expect(result).toEqual({
      name: 'Spain',
      officialName: 'Kingdom of Spain',
      flag: 'https://flagcdn.com',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505992,
      languages: ['Spanish'],
      currencies: ['Euro (€)'],
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      description: 'Country in Southwestern Europe.',
    });
  });

  it('provides safe fallback values when optional fields are missing', () => {
    const minimalRaw: RawCountry = {
      name: 'Antarctica',
    };

    const result = mapCountryResponse(minimalRaw);

    expect(result).toEqual({
      name: 'Antarctica',
      officialName: 'Antarctica',
      flag: '',
      capital: 'Нет данных',
      region: 'Нет данных',
      population: 0,
      area: 0,
      languages: [],
      currencies: [],
      borders: [],
      description: '',
    });
  });
});
