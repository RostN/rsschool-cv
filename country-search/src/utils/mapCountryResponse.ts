import type { Country, RawCountry } from '../types/country.js';

export function mapCountryResponse(raw: RawCountry): Country {
  const directFlag =
    raw.flags?.png ??
    raw.flags?.svg ??
    (raw.flag?.startsWith('http') ? raw.flag : '');

  const countryCode = raw.alpha2Code ?? raw.code ?? raw.cca2 ?? raw.iso2;

  const flagUrl =
    directFlag ||
    (countryCode
      ? 'https://flagcdn.com' + `/w320/${countryCode.toLowerCase()}.png`
      : '');

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
