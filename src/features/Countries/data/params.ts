export type SearchCountriesParams = {
  q: string;
  limit?: number;
  offset?: number;
};

export type ListCountriesParams = {
  limit?: number;
  offset?: number;
};

export type GetCountryParams = {
  code: string;
};
