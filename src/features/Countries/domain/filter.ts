import { Country } from './types'

export function filterCountries(countries: Country[], query: string): Country[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return []

  return countries.filter((country) =>
    country.name.toLowerCase().includes(normalizedQuery)
  )
}