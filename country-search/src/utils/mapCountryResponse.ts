import type { Country, RawCountry } from '../types/country.js';

export function mapCountryResponse(raw: RawCountry): Country {
  const flagUrl = raw.flag ?? raw.flags?.png ?? raw.flags?.svg ?? '';

  const languages = Array.isArray(raw.languages)
    ? raw.languages.map((lang) => lang.name)
    : [];

  const currencies = Array.isArray(raw.currencies)
    ? raw.currencies.map((curr) =>
        curr.symbol ? `${curr.name} (${curr.symbol})` : curr.name
      )
    : [];

  return {
    name: raw.name,
    officialName: raw.officialName ?? raw.name,
    flag: flagUrl,
    capital: raw.capital || 'Нет данных',
    region: raw.region || 'Нет данных',
    population: raw.population ?? 0,
    area: raw.area ?? 0,
    languages,
    currencies,
    borders: Array.isArray(raw.borders) ? raw.borders : [],
    description: raw.description ?? '',
  };
}
