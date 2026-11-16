export interface RawCurrency {
  code: string;
  name: string;
  symbol?: string;
}

export interface RawLanguage {
  code: string;
  name: string;
}

export interface RawCountry {
  name: string;
  alpha2Code?: string;
  code?: string;
  cca2?: string;
  iso2?: string;
  officialName?: string;
  capital?: string;
  region?: string;
  population?: number;
  area?: number;
  flag?: string;
  flags?: {
    png?: string;
    svg?: string;
  };
  languages?: RawLanguage[];
  currencies?: RawCurrency[];
  borders?: string[];
  description?: string;
}

export interface Country {
  name: string;
  officialName: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  languages: string[];
  currencies: string[];
  borders: string[];
  description: string;
}
