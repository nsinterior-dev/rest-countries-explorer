export interface CountryDto {
  names: {
    common: string;
    official: string;
  };
  currencies: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
  flag: {
    url_svg: string;
    description: string;
    emoji: string;
  };
  cars: {
    driving_side: string;
  };
}

export interface CountryApiResponse {
  data: {
    objects: CountryDto[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}
