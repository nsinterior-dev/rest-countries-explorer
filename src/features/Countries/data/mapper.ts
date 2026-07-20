import { Country, DrivingSide } from "../domain";
import { CountryDto } from "./dto";

export function toCountry(dto: CountryDto): Country {
  const { names, flag, currencies, cars } = dto;

  return {
    name: names.common,
    officialName: names.official,
    flag: {
      url: flag.url_svg,
      description: flag.description,
      emoji: flag.emoji,
    },
    currencies: currencies.map(({ code, name, symbol }) => ({ code, name, symbol })),
    drivesOn: cars.driving_side as DrivingSide,
  };
}
